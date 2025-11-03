import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const { toast } = useToast();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your content...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4',
      },
    },
  });

  const handleAIAssist = async (action: 'improve' | 'expand' | 'summarize' | 'generate') => {
    if (!editor) return;

    const currentContent = editor.getText();
    
    if (action !== 'generate' && !currentContent.trim()) {
      toast({
        title: 'No content',
        description: 'Please add some content first',
        variant: 'destructive',
      });
      return;
    }

    if (action === 'generate' && !aiPrompt.trim()) {
      toast({
        title: 'No prompt',
        description: 'Please enter what you want to generate',
        variant: 'destructive',
      });
      return;
    }

    setAiLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-content-assist', {
        body: {
          action,
          prompt: aiPrompt,
          currentContent: editor.getHTML(),
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      editor.commands.setContent(data.content);
      setAiDialogOpen(false);
      setAiPrompt('');
      
      toast({
        title: 'Success',
        description: 'Content updated with AI assistance',
      });
    } catch (error: any) {
      console.error('AI assist error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process AI request',
        variant: 'destructive',
      });
    } finally {
      setAiLoading(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* AI Assistance Toolbar */}
      <div className="border-b bg-primary/5 p-2 flex flex-wrap gap-2">
        <span className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          AI Assistance:
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setAiDialogOpen(true)}
          disabled={aiLoading}
        >
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAIAssist('improve')}
          disabled={aiLoading}
        >
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Improve'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAIAssist('expand')}
          disabled={aiLoading}
        >
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Expand'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAIAssist('summarize')}
          disabled={aiLoading}
        >
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Summarize'}
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* AI Generate Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Content with AI</DialogTitle>
            <DialogDescription>
              Describe what content you'd like to generate, and AI will create it for you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ai-prompt">What would you like to write about?</Label>
              <Textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Write a comprehensive guide about buying homes in Miami, Florida..."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAIAssist('generate')}
                disabled={aiLoading || !aiPrompt.trim()}
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
