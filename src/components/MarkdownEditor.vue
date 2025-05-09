<template>
    <div class="p-5">
      <section
        v-if="editor"
        class="areaButtons  flex  flex-wrap rounded-t items-center  gap-x-4  border-2  border-b-0  border-primary-400  p-2"
      >
        <!-- Bold, Italic, Strike, Underline, Highlight -->
        <div class="GruppoBottoni FomattazioneEDecorazioni">
          <Button
            class="tagButton"
            size="small"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
          >
            <i class="bi bi-type-bold"   ></i>
          </Button>
          <Button
            class="tagButton"
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
          >
            <i class="bi bi-type-italic"   ></i>
          </Button>
          
          
          <Button
            class="tagButton"
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
          >
            <i class="bi bi-type-strikethrough"   ></i>
            </Button>

          <Button
            class="tagButton"
            @click="editor.chain().focus().toggleUnderline().run()"
            :disabled="!editor.can().chain().focus().toggleUnderline().run()"
            :class="{ 'is-active': editor.isActive('underline') }"
            >
            <i class="bi bi-type-underline"   ></i>
        </Button>

          <Button
            class="tagButton"
            @click="editor.chain().focus().toggleHighlight().run()"
            :class="{ 'is-active': editor.isActive('highlight') }"
            >
            <i class="bi bi-highlighter"   ></i>
            </Button>
        </div>
  
        <!-- Font size +/- -->
        <div class="GruppoBottoni ring-2 ring-primary-400 rounded-md FontSize  flex  items-center  gap-2">
          <Button
            icon="pi pi-minus"
            @click="editor.chain().focus().setFontSize(convertToFontSize(--fontsizeNumber)).run()"
          />
          <span style="font-weight: bold;">{{ fontsizeNumber }}</span>
          <Button
            icon="pi pi-plus"
            @click="editor.chain().focus().setFontSize(convertToFontSize(++fontsizeNumber)).run()"
          />
        </div>
  
        <!-- Lists, Code, Image, Horizontal Rule -->
        <div class="GruppoBottoni OrganizazioneTesto">
          <!-- Bullet List Button -->
          <Button
            class="tagButton"
            @click="() => { editor.chain().focus().toggleBulletList().run(); }"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            icon="bi bi-list-ul"
          />

          <!-- Ordered List Button -->
          <Button
            class="tagButton"
            @click="() => { editor.chain().focus().toggleOrderedList().run(); }"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            icon="bi bi-list-ol"
          />
          <Button
            class="tagButton"
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :disabled="!editor.can().chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('code') }"
          >
            <i class="bi bi-code"   ></i>
          </Button>
          <Button @click="addImage" class="tagButton">
            <i class="bi bi-image"   ></i>
            <Dialog
              header="Insert Image"
              :visible="showInsertImageDialog"
              :modal="true"
              :closable="false"
              :dismissableMask="true"
              @hide="showInsertImageDialog = false"
              :style="{ width: '50vw' }"
            >
            <InsertFileDialog 
              @close="showInsertImageDialog = false" 
              @image-uploaded="handleImageUpload" />
            </Dialog>
          </Button>
          <Button 
            class="tagButton" 
            @click="editor.chain().focus().setHorizontalRule().run()"
            icon="bi bi-hr"
            >
          </Button>
        </div>
  
        <!-- Text Alignment -->
        <div class="GruppoBottoni allinieamento">
          <Button
            class="tagButton"
            @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          >
            <i class="bi bi-text-left"   ></i>
          </Button>
          <Button
            class="tagButton"
            @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          >
            <i class="bi bi-text-center"   ></i>
          </Button>
          <Button
            class="tagButton"
            @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          >
            <i class="bi bi-text-right"   ></i>
          </Button>
          <Button
            class="tagButton"
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          >
            <i class="bi bi-justify"   ></i>
          </Button>
        </div>
  
        <!-- Undo/Redo -->
        <div class="GruppoBottoni navigazioneStoriaTesto">
          <Button
            class="tagButton"
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
          >
            <i class="bi bi-arrow-counterclockwise"   ></i>
          </Button>
          <Button
            class="tagButton"
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
          >
            <i class="bi bi-arrow-clockwise"></i>
          </Button>
        </div>
      </section>
  
      <editor-content :editor="editor" class="editor-content" />
    </div>
  </template>
  
  <script setup>
  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import { ref } from 'vue'
  import Button from 'primevue/button'
  import Dialog from 'primevue/dialog'

  import InsertFileDialog from './Dialogs/InsertFileDialog.vue'
  
  // TipTap extensions
  import StarterKit from '@tiptap/starter-kit'
  
  import { Color } from '@tiptap/extension-color'
  
  
  import FontSize from '@tiptap/extension-font-size'
  import { FontFamily } from '@tiptap/extension-font-family'
  import Underline from '@tiptap/extension-underline'
  import TextStyle from '@tiptap/extension-text-style'
  import Image from '@tiptap/extension-image'
  import TextAlign from '@tiptap/extension-text-align'
  import Highlight from '@tiptap/extension-highlight'
  
  
  const showInsertImageDialog = ref(false)
  const fontsizeNumber = ref(12)


  const props = defineProps({
    modelValue: String,
  })
  const emit = defineEmits(['update:modelValue'])
  
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'border-2 border-primary-400 rounded-b p-2 min-h-[20rem] max-h-[12rem] overflow-y-auto  outline-none',
      },
    },
    content: props.modelValue,
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'tiptap-code',
          },
        },
        
        listItem: {
          nested: true,
        },
      }),
      Highlight,
      Image.configure({
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Underline,
      FontSize,
      TextStyle.configure({ 
        mergeNestedSpanStyles: true 
      }),
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    onUpdate: ({ editor }) => {
      const rawHtml = editor.getHTML();
      const flattened = flattenParagraphsInList(rawHtml);
      emit('update:modelValue', flattened);

      // Controlla se il contenuto è vuoto e aggiungi un paragrafo con allineamento predefinito
      if (editor.isEmpty) {
        editor.commands.setContent('<p style="text-align: left;"></p>');
      }
    },
    onCreate: ({ editor }) => {
      // Assicurati che il testo sia allineato a sinistra per impostazione predefinita
      editor.chain().focus().setTextAlign('left').run();
    },
  })
  
  function convertToFontSize(fontSize) {
    return fontSize + 'pt'
  }

  function flattenParagraphsInList(html) {
    return html.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/g, '<li>$1</li>');
  }

  const handleImageUpload = (imageUrl) => {
    console.log('URL immagine caricata:', imageUrl);
    console.log('Test url', imageUrl.value);
    if (imageUrl) {
      editor.value?.chain().focus().setImage({ src: imageUrl }).run()
    }
    showInsertImageDialog.value = false
    // Aggiungi l'URL al contenuto del markdown editor o gestiscilo come necessario
  };
  
  function addImage() {
    showInsertImageDialog.value = true
  }

  </script>
  
  <style >
  button.tagButton {
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    text-align: center;
    font-size: 1.3rem;
    text-decoration: none;
    margin: 0.5rem 0.1rem;
    cursor: pointer;
    border-radius: 12px;
  }
  button.is-active {
    outline-offset: -1px;
    outline-style: groove;
  }

  .tiptap-code {
    display: block;
    text-align: left;
    background-color: #f0f0f0;
    border-radius: 0.4rem;
    color: #000;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  .tiptap-paragraph {
    text-align: left;
  }
  
  .editor-content ul,
  .editor-content ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
  }

  .editor-content ul {
    list-style-type: disc;
  }

  .editor-content ol {
    list-style-type: decimal;
  }

  .editor-content li {
    margin-bottom: 0.25rem;
  }

  .editor-content li p {
    text-align: left;
  }

  .tiptap-image {
  margin: 1.5rem auto; /* top/bottom = 1.5rem, left/right = auto */
  max-width: 100%;
  height: auto;
}

  </style>
