import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        [{ align: [] }],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
  ];

  const handleAIAssist = async (action: 'improve' | 'expand' | 'summarize' | 'generate') => {
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (action !== 'generate' && !textContent) {
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
          currentContent: content,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      onChange(data.content);
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

  return (
    <div className="border rounded-lg overflow-hidden">
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
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Start writing your content...'}
        className="min-h-[300px] quill-editor"
      />

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
