import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Plus, Folder as FolderIcon, Lightbulb, MoreVertical, Edit3, Trash2, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

type Idea = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type IdeaFolder = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ideaIds: string[];
};

type IdeasState = {
  folders: IdeaFolder[];
  ideas: Record<string, Idea>;
};

const STORAGE_KEY = 'joggle_ideas_state_v1';
const DND_TYPE_IDEA = 'IDEA_ITEM';
const ALL_FOLDER_ID = 'all';
const ALL_FOLDER_NAME = 'All';

function ensureAllFolderExists(state: IdeasState): IdeasState {
  const hasAll = state.folders.some(f => f.id === ALL_FOLDER_ID);
  if (hasAll) return state;
  const now = new Date().toISOString();
  const allFolder: IdeaFolder = { id: ALL_FOLDER_ID, name: ALL_FOLDER_NAME, createdAt: now, updatedAt: now, ideaIds: [] };
  return { ...state, folders: [allFolder, ...state.folders] };
}

function loadState(): IdeasState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ensureAllFolderExists({ folders: [], ideas: {} });
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.folders) || typeof parsed.ideas !== 'object') {
      return ensureAllFolderExists({ folders: [], ideas: {} });
    }
    return ensureAllFolderExists(parsed as IdeasState);
  } catch {
    return ensureAllFolderExists({ folders: [], ideas: {} });
  }
}

function saveState(state: IdeasState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

type FolderCardProps = {
  folder: IdeaFolder;
  isActive: boolean;
  totalAllCount: number;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDropIdea: (ideaId: string) => void;
};

const FolderCard: React.FC<FolderCardProps> = ({ folder, isActive, totalAllCount, onClick, onEdit, onDelete, onDropIdea }) => {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: DND_TYPE_IDEA,
    canDrop: () => folder.id !== ALL_FOLDER_ID,
    drop: (item: { ideaId: string }) => onDropIdea(item.ideaId),
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  }), [folder.id]);
  const bg = isOver && canDrop ? 'bg-[#A8E6CF]/30' : isActive ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10';
  const ideaCount = folder.id === ALL_FOLDER_ID ? totalAllCount : folder.ideaIds.length;
  return (
    <div ref={dropRef} className={`rounded-2xl min-w-[180px]`} onClick={onClick}>
      <Card className={`border-white/10 p-3 cursor-pointer ${bg}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FolderIcon className="w-4 h-4 text-[#89CFF0]" />
            <h3 className="text-white text-sm truncate max-w-[110px]">{folder.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-[#B0B0B0]">
            {folder.id !== ALL_FOLDER_ID && (
              <>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="hover:text-white"><Edit3 className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="hover:text-white"><Trash2 className="w-4 h-4" /></button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#B0B0B0] mt-2">
          <ChevronRight className="w-3 h-3" />
          <span>{ideaCount} ideas</span>
        </div>
      </Card>
    </div>
  );
};

type IdeaCardProps = {
  idea: Idea;
  onEdit: () => void;
  onDelete: () => void;
};

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onEdit, onDelete }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: DND_TYPE_IDEA,
    item: { ideaId: idea.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [idea.id]);
  return (
    <Card ref={dragRef} className={`bg-white/5 border-white/10 p-4 rounded-2xl ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-3">
          <h3 className="text-white text-sm mb-1">{idea.title}</h3>
          {idea.content && <p className="text-[#B0B0B0] text-xs whitespace-pre-wrap">{idea.content}</p>}
        </div>
        <div className="flex items-center gap-2 text-[#B0B0B0]">
          <button onClick={onEdit} className="hover:text-white"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="hover:text-white"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </Card>
  );
};

type IdeasHandle = {
  openAddIdea: () => void;
};

export const Ideas = forwardRef<IdeasHandle>(function Ideas(_props, ref) {
  const [state, setState] = useState<IdeasState>(() => loadState());
  const [activeFolderId, setActiveFolderId] = useState<string | null>(ALL_FOLDER_ID);

  const [isFolderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  const [isIdeaDialogOpen, setIdeaDialogOpen] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaContent, setIdeaContent] = useState('');
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [ideaTargetFolderId, setIdeaTargetFolderId] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openAddIdea: () => openCreateIdea(),
  }));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const activeFolder = useMemo(() => state.folders.find(f => f.id === activeFolderId) || null, [state.folders, activeFolderId]);
  const ideasInActiveFolder = useMemo(() => {
    if (!activeFolder) return [] as Idea[];
    if (activeFolder.id === ALL_FOLDER_ID) {
      const ids = new Set<string>();
      state.folders.forEach(f => {
        if (f.id === ALL_FOLDER_ID) return;
        f.ideaIds.forEach(id => ids.add(id));
      });
      return Array.from(ids).map(id => state.ideas[id]).filter(Boolean);
    }
    return activeFolder.ideaIds.map(id => state.ideas[id]).filter(Boolean);
  }, [activeFolder, state.folders, state.ideas]);

  function moveIdeaToFolder(ideaId: string, targetFolderId: string) {
    if (targetFolderId === ALL_FOLDER_ID) return; // All is virtual; no-op for drop
    setState(prev => {
      const cleanedFolders = prev.folders.map(f =>
        f.id === ALL_FOLDER_ID ? f : { ...f, ideaIds: f.ideaIds.filter(id => id !== ideaId) }
      );
      const now = new Date().toISOString();
      const updatedFolders = cleanedFolders.map(f =>
        f.id === targetFolderId ? { ...f, ideaIds: [ideaId, ...f.ideaIds.filter(id => id !== ideaId)], updatedAt: now } : f
      );
      return { ...prev, folders: updatedFolders };
    });
  }

  function openCreateFolder() {
    setEditingFolderId(null);
    setFolderName('');
    setFolderDialogOpen(true);
  }

  function openEditFolder(folder: IdeaFolder) {
    if (folder.id === ALL_FOLDER_ID) return; // prevent editing All
    setEditingFolderId(folder.id);
    setFolderName(folder.name);
    setFolderDialogOpen(true);
  }

  function submitFolder() {
    const name = folderName.trim();
    if (!name) return;
    const now = new Date().toISOString();
    if (editingFolderId) {
      if (editingFolderId === ALL_FOLDER_ID) return; // safeguard
      setState(prev => ({
        ...prev,
        folders: prev.folders.map(f => f.id === editingFolderId ? { ...f, name, updatedAt: now } : f),
      }));
    } else {
      const id = generateId('folder');
      const folder: IdeaFolder = { id, name, createdAt: now, updatedAt: now, ideaIds: [] };
      setState(prev => ({ ...prev, folders: [...prev.folders, folder] }));
      setActiveFolderId(id);
    }
    setFolderDialogOpen(false);
  }

  function deleteFolder(folderId: string) {
    if (folderId === ALL_FOLDER_ID) return; // cannot delete All
    setState(prev => {
      const folder = prev.folders.find(f => f.id === folderId);
      if (!folder) return prev;
      const newIdeas = { ...prev.ideas };
      folder.ideaIds.forEach(id => { delete newIdeas[id]; });
      const newFolders = prev.folders.filter(f => f.id !== folderId);
      return { folders: newFolders, ideas: newIdeas };
    });
    if (activeFolderId === folderId) setActiveFolderId(null);
  }

  function openCreateIdea() {
    if (!activeFolder) return;
    setEditingIdeaId(null);
    setIdeaTitle('');
    setIdeaContent('');
    if (activeFolder.id === ALL_FOLDER_ID) {
      const firstRealFolder = state.folders.find(f => f.id !== ALL_FOLDER_ID) || null;
      setIdeaTargetFolderId(firstRealFolder ? firstRealFolder.id : null);
      setIdeaDialogOpen(true);
      return;
    }
    setIdeaTargetFolderId(activeFolder.id);
    setIdeaDialogOpen(true);
  }

  function openEditIdea(idea: Idea) {
    setEditingIdeaId(idea.id);
    setIdeaTitle(idea.title);
    setIdeaContent(idea.content);
    setIdeaDialogOpen(true);
  }

  function submitIdea() {
    if (!activeFolder) return;
    const title = ideaTitle.trim() || 'Untitled idea';
    const content = ideaContent.trim();
    const now = new Date().toISOString();
    if (editingIdeaId) {
      setState(prev => ({
        ...prev,
        ideas: {
          ...prev.ideas,
          [editingIdeaId]: { ...prev.ideas[editingIdeaId], title, content, updatedAt: now },
        },
      }));
    } else {
      const id = generateId('idea');
      const idea: Idea = { id, title, content, createdAt: now, updatedAt: now };
      const targetFolderId = activeFolder.id === ALL_FOLDER_ID ? ideaTargetFolderId : activeFolder.id;
      if (!targetFolderId) return; // no destination folder available
      setState(prev => ({
        folders: prev.folders.map(f => f.id === targetFolderId ? { ...f, ideaIds: [id, ...f.ideaIds], updatedAt: now } : f),
        ideas: { ...prev.ideas, [id]: idea },
      }));
    }
    setIdeaDialogOpen(false);
  }

  function deleteIdea(id: string) {
    setState(prev => ({
      folders: prev.folders.map(f => ({ ...f, ideaIds: f.id === ALL_FOLDER_ID ? f.ideaIds : f.ideaIds.filter(x => x !== id) })),
      ideas: Object.fromEntries(Object.entries(prev.ideas).filter(([key]) => key !== id)),
    }));
  }

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      <div className="mb-4">
        <h1 className="text-xl text-white mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-[#FFF9A6]" /> Ideas</h1>
        <p className="text-xs text-[#B0B0B0]">Capture ideas, organize in folders, revisit anytime.</p>
      </div>

      {/* Folders header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-sm">Folders</h2>
        <button onClick={openCreateFolder} className="flex items-center gap-1 text-[#C9B6E4] text-sm">
          <Plus className="w-4 h-4" /> New Folder
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 mb-4">
        {state.folders.length === 0 && (
          <Card className="bg-white/5 border-white/10 p-4 rounded-2xl min-w-[180px]">
            <p className="text-[#B0B0B0] text-sm">No folders yet. Create one to begin.</p>
          </Card>
        )}
        {state.folders.map(folder => (
          <FolderCard
            key={folder.id}
            folder={folder}
            isActive={activeFolderId === folder.id}
            totalAllCount={state.folders.reduce((acc, f) => f.id === ALL_FOLDER_ID ? acc : acc + f.ideaIds.length, 0)}
            onClick={() => setActiveFolderId(folder.id)}
            onEdit={() => openEditFolder(folder)}
            onDelete={() => deleteFolder(folder.id)}
            onDropIdea={(ideaId) => moveIdeaToFolder(ideaId, folder.id)}
          />
        ))}
      </div>

      {/* Ideas list */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white text-sm">{activeFolder ? activeFolder.name : 'Select a folder'}</h2>
        {activeFolder && (
          <button onClick={openCreateIdea} className="flex items-center gap-1 text-[#A8E6CF] text-sm">
            <Plus className="w-4 h-4" /> New Idea
          </button>
        )}
      </div>

      <div className="space-y-2">
        {activeFolder && ideasInActiveFolder.length === 0 && (
          <Card className="bg-white/5 border-white/10 p-4 rounded-2xl">
            <p className="text-[#B0B0B0] text-sm">No ideas here yet. Add your first idea.</p>
          </Card>
        )}
        {activeFolder && ideasInActiveFolder.map(idea => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onEdit={() => openEditIdea(idea)}
            onDelete={() => deleteIdea(idea.id)}
          />
        ))}
      </div>

      {/* Folder Dialog */}
      <Dialog open={isFolderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingFolderId ? 'Edit Folder' : 'New Folder'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder name" className="bg-white/5 border-white/10" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitFolder}>{editingFolderId ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Idea Dialog */}
      <Dialog open={isIdeaDialogOpen} onOpenChange={setIdeaDialogOpen}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>{editingIdeaId ? 'Edit Idea' : 'New Idea'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {!editingIdeaId && activeFolder && activeFolder.id === ALL_FOLDER_ID && (
              <div>
                <label className="text-xs text-[#B0B0B0] mb-1 block">Destination folder</label>
                <Select value={ideaTargetFolderId ?? undefined} onValueChange={setIdeaTargetFolderId}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.folders.filter(f => f.id !== ALL_FOLDER_ID).map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Input value={ideaTitle} onChange={(e) => setIdeaTitle(e.target.value)} placeholder="Title" className="bg-white/5 border-white/10" />
            <Textarea value={ideaContent} onChange={(e) => setIdeaContent(e.target.value)} placeholder="Write your idea..." className="bg-white/5 border-white/10 min-h-[120px]" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIdeaDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitIdea} disabled={!editingIdeaId && activeFolder && activeFolder.id === ALL_FOLDER_ID && !ideaTargetFolderId}>{editingIdeaId ? 'Save' : 'Add Idea'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Ideas;
