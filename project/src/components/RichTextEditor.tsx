import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Smile,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type
} from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showEmoji, setShowEmoji] = useState(false);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleEmoji = (emoji: any) => {
    onChange(value + emoji.native);
    setShowEmoji(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleFormat('insertImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('bold')}
          className="h-8 w-8"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('italic')}
          className="h-8 w-8"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('underline')}
          className="h-8 w-8"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('strikeThrough')}
          className="h-8 w-8"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Headers */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('formatBlock', '<h1>')}
          className="h-8 w-8"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('formatBlock', '<h2>')}
          className="h-8 w-8"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('formatBlock', '<h3>')}
          className="h-8 w-8"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('insertUnorderedList')}
          className="h-8 w-8"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('insertOrderedList')}
          className="h-8 w-8"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('justifyLeft')}
          className="h-8 w-8"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('justifyCenter')}
          className="h-8 w-8"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('justifyRight')}
          className="h-8 w-8"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        {/* Font Size */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((size) => (
                <Button
                  key={size}
                  variant="ghost"
                  onClick={() => handleFormat('fontSize', size.toString())}
                  className="justify-start"
                >
                  Size {size}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Insert Options */}
        <div className="w-px h-8 bg-border mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowEmoji(true)}
          className="h-8 w-8"
        >
          <Smile className="h-4 w-4" />
        </Button>

        <label>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Image className="h-4 w-4" />
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) handleFormat('createLink', url);
          }}
          className="h-8 w-8"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        placeholder={placeholder}
      />

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute z-50">
          <Picker
            data={data}
            onEmojiSelect={handleEmoji}
            onClickOutside={() => setShowEmoji(false)}
          />
        </div>
      )}
    </div>
  );
}