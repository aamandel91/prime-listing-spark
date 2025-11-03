import { ContentModule } from "@/types/contentModules";

interface ContentModuleRendererProps {
  module: ContentModule;
}

export default function ContentModuleRenderer({ module }: ContentModuleRendererProps) {
  return (
    <div className="module-content">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: module.content }}
      />
    </div>
  );
}
