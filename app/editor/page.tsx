"use client"

import markdownit from 'markdown-it'
import { useEffect, useMemo, useState } from 'react';
import prismjs from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-markdown';

const md = markdownit()

// const grammar:prismjs.Grammar = (() => {
//     const grammars: prismjs.Grammar= {
//         main: {},
//         list: {},
//         blockquote: {},
//         table: {},
//         deflist: {},
//     };

//     grammars.deflist.deflist = {
//         pattern: new RegExp(
//             [
//                 '^ {0,3}\\S.*\\n', // Description line
//                 '(?:[ \\t]*\\n)?', // Optional empty line
//                 '(?:',
//                 '[ \\t]*:[ \\t].*\\n', // Colon line
//                 '(?:',
//                 '(?:',
//                 '.*\\S.*\\n', // Non-empty line
//                 '|',
//                 '[ \\t]*\\n(?! ?\\S)', // Or empty line not followed by unindented line
//                 ')',
//                 ')*',
//                 '(?:[ \\t]*\\n)*', // Empty lines
//                 ')+',
//             ].join(''),
//             'm',
//         ),
//         inside: {
//             term: /^.+/,
//             cl: /^[ \t]*:[ \t]/gm,
//         },
//     };

//     const insideFences = options.insideFences || {};
//     insideFences['cl cl-pre'] = /```|~~~/;
//     if (options.fence) {
//         grammars.main['pre gfm'] = {
//             pattern: /^(```|~~~)[\s\S]*?\n\1 *$/gm,
//             inside: insideFences,
//         };
//         grammars.list['pre gfm'] = {
//             pattern: /^(?: {4}|\t)(```|~~~)[\s\S]*?\n(?: {4}|\t)\1\s*$/gm,
//             inside: insideFences,
//         };
//         grammars.deflist.deflist.inside['pre gfm'] = grammars.list['pre gfm'];
//     }

//     grammars.main['h1 alt'] = {
//         pattern: /^.+\n=+[ \t]*$/gm,
//         inside: {
//             'cl cl-hash': /=+[ \t]*$/,
//         },
//     };
//     grammars.main['h2 alt'] = {
//         pattern: /^.+\n-+[ \t]*$/gm,
//         inside: {
//             'cl cl-hash': /-+[ \t]*$/,
//         },
//     };
//     for (let i = 6; i >= 1; i -= 1) {
//         grammars.main[`h${i}`] = {
//             pattern: new RegExp(`^#{${i}}[ \t].+$`, 'gm'),
//             inside: {
//                 'cl cl-hash': new RegExp(`^#{${i}}`),
//             },
//         };
//     }

//     const list = /^[ \t]*([*+-]|\d+\.)[ \t]/gm;
//     const blockquote = {
//         pattern: /^\s*>.*(?:\n[ \t]*\S.*)*/gm,
//         inside: {
//             'cl cl-gt': /^\s*>/gm,
//             'cl cl-li': list,
//         },
//     };
//     grammars.list.blockquote = blockquote;
//     grammars.blockquote.blockquote = blockquote;
//     grammars.deflist.deflist.inside.blockquote = blockquote;
//     grammars.list['cl cl-li'] = list;
//     grammars.blockquote['cl cl-li'] = list;
//     grammars.deflist.deflist.inside['cl cl-li'] = list;

//     grammars.table.table = {
//         pattern: new RegExp(
//             [
//                 '^\\s*\\S.*[|].*\\n', // Header Row
//                 '[-| :]+\\n', // Separator
//                 '(?:.*[|].*\\n?)*', // Table rows
//                 '$',
//             ].join(''),
//             'gm',
//         ),
//         inside: {
//             'cl cl-title-separator': /^[-| :]+$/gm,
//             'cl cl-pipe': /[|]/gm,
//         },
//     };

//     grammars.main.hr = {
//         pattern: /^ {0,3}([*\-_] *){3,}$/gm,
//     };

//     if (options.tasklist) {
//         grammars.list.task = {
//             pattern: /^\[[ xX]\] /,
//             inside: {
//                 cl: /[[\]]/,
//                 strong: /[xX]/,
//             },
//         };
//     }

//     const defs = {};
//     if (options.footnote) {
//         defs.fndef = {
//             pattern: /^ {0,3}\[\^.*?\]:.*$/gm,
//             inside: {
//                 'ref-id': {
//                     pattern: /^ {0,3}\[\^.*?\]/,
//                     inside: {
//                         cl: /(\[\^|\])/,
//                     },
//                 },
//             },
//         };
//     }
//     if (options.abbr) {
//         defs.abbrdef = {
//             pattern: /^ {0,3}\*\[.*?\]:.*$/gm,
//             inside: {
//                 'abbr-id': {
//                     pattern: /^ {0,3}\*\[.*?\]/,
//                     inside: {
//                         cl: /(\*\[|\])/,
//                     },
//                 },
//             },
//         };
//     }
//     defs.linkdef = {
//         pattern: /^ {0,3}\[.*?\]:.*$/gm,
//         inside: {
//             'link-id': {
//                 pattern: /^ {0,3}\[.*?\]/,
//                 inside: {
//                     cl: /[[\]]/,
//                 },
//             },
//             url: urlPattern,
//         },
//     };

//     Object.entries(defs).forEach(([name, def]) => {
//         grammars.main[name] = def;
//         grammars.list[name] = def;
//         grammars.blockquote[name] = def;
//         grammars.table[name] = def;
//         grammars.deflist[name] = def;
//     });

//     grammars.main.pre = {
//         pattern: /^\s*\n(?: {4}|\t).*\S.*\n((?: {4}|\t).*\n)*/gm,
//     };

//     const rest = {};
//     rest.code = {
//         pattern: /(`+)[\s\S]*?\1/g,
//         inside: {
//             'cl cl-code': /`/,
//         },
//     };
//     if (options.math) {
//         rest['math block'] = {
//             pattern: /\\\\\[[\s\S]*?\\\\\]/g,
//             inside: {
//                 'cl cl-bracket-start': /^\\\\\[/,
//                 'cl cl-bracket-end': /\\\\\]$/,
//                 rest: latex,
//             },
//         };
//         rest['math inline'] = {
//             pattern: /\\\\\([\s\S]*?\\\\\)/g,
//             inside: {
//                 'cl cl-bracket-start': /^\\\\\(/,
//                 'cl cl-bracket-end': /\\\\\)$/,
//                 rest: latex,
//             },
//         };
//         rest['math expr block'] = {
//             pattern: /(\$\$)[\s\S]*?\1/g,
//             inside: {
//                 'cl cl-bracket-start': /^\$\$/,
//                 'cl cl-bracket-end': /\$\$$/,
//                 rest: latex,
//             },
//         };
//         rest['math expr inline'] = {
//             pattern: /\$(?!\s)[\s\S]*?\S\$(?!\d)/g,
//             inside: {
//                 'cl cl-bracket-start': /^\$/,
//                 'cl cl-bracket-end': /\$$/,
//                 rest: latex,
//             },
//         };
//     }
//     if (options.footnote) {
//         rest.inlinefn = {
//             pattern: /\^\[.+?\]/g,
//             inside: {
//                 cl: /(\^\[|\])/,
//             },
//         };
//         rest.fn = {
//             pattern: /\[\^.+?\]/g,
//             inside: {
//                 cl: /(\[\^|\])/,
//             },
//         };
//     }
//     rest.img = {
//         pattern: /!\[.*?\]\(.+?\)/g,
//         inside: {
//             'cl cl-title': /['‘][^'’]*['’]|["“][^"”]*["”](?=\)$)/,
//             'cl cl-src': {
//                 pattern: /(\]\()[^('" \t]+(?=[)'" \t])/,
//                 lookbehind: true,
//             },
//         },
//     };
//     if (options.imgsize) {
//         rest.img.inside['cl cl-size'] = /=\d*x\d*/;
//     }
//     rest.link = {
//         pattern: /\[.*?\]\(.+?\)/gm,
//         inside: {
//             'cl cl-underlined-text': {
//                 pattern: /(\[)[^\]]*/,
//                 lookbehind: true,
//             },
//             'cl cl-title': /['‘][^'’]*['’]|["“][^"”]*["”](?=\)$)/,
//         },
//     };
//     rest.imgref = {
//         pattern: /!\[.*?\][ \t]*\[.*?\]/g,
//     };
//     rest.linkref = {
//         pattern: /\[.*?\][ \t]*\[.*?\]/g,
//         inside: {
//             'cl cl-underlined-text': {
//                 pattern: /^(\[)[^\]]*(?=\][ \t]*\[)/,
//                 lookbehind: true,
//             },
//         },
//     };
//     rest.comment = markup.comment;
//     rest.tag = markup.tag;
//     rest.url = urlPattern;
//     rest.email = emailPattern;
//     rest.strong = {
//         pattern: /(^|[^\w*])(__|\*\*)(?![_*])[\s\S]*?\2(?=([^\w*]|$))/gm,
//         lookbehind: true,
//         inside: {
//             'cl cl-strong cl-start': /^(__|\*\*)/,
//             'cl cl-strong cl-close': /(__|\*\*)$/,
//         },
//     };
//     rest.em = {
//         pattern: /(^|[^\w*])(_|\*)(?![_*])[\s\S]*?\2(?=([^\w*]|$))/gm,
//         lookbehind: true,
//         inside: {
//             'cl cl-em cl-start': /^(_|\*)/,
//             'cl cl-em cl-close': /(_|\*)$/,
//         },
//     };
//     rest['strong em'] = {
//         pattern: /(^|[^\w*])(__|\*\*)(_|\*)(?![_*])[\s\S]*?\3\2(?=([^\w*]|$))/gm,
//         lookbehind: true,
//         inside: {
//             'cl cl-strong cl-start': /^(__|\*\*)(_|\*)/,
//             'cl cl-strong cl-close': /(_|\*)(__|\*\*)$/,
//         },
//     };
//     rest['strong em inv'] = {
//         pattern: /(^|[^\w*])(_|\*)(__|\*\*)(?![_*])[\s\S]*?\3\2(?=([^\w*]|$))/gm,
//         lookbehind: true,
//         inside: {
//             'cl cl-strong cl-start': /^(_|\*)(__|\*\*)/,
//             'cl cl-strong cl-close': /(__|\*\*)(_|\*)$/,
//         },
//     };
//     if (options.del) {
//         rest.del = {
//             pattern: /(^|[^\w*])(~~)[\s\S]*?\2(?=([^\w*]|$))/gm,
//             lookbehind: true,
//             inside: {
//                 cl: /~~/,
//                 'cl-del-text': /[^~]+/,
//             },
//         };
//     }
//     if (options.mark) {
//         rest.mark = {
//             pattern: /(^|[^\w*])(==)[\s\S]*?\2(?=([^\w*]|$))/gm,
//             lookbehind: true,
//             inside: {
//                 cl: /==/,
//                 'cl-mark-text': /[^=]+/,
//             },
//         };
//     }
//     if (options.sub) {
//         rest.sub = {
//             pattern: /(~)(?=\S)(.*?\S)\1/gm,
//             inside: {
//                 cl: /~/,
//             },
//         };
//     }
//     if (options.sup) {
//         rest.sup = {
//             pattern: /(\^)(?=\S)(.*?\S)\1/gm,
//             inside: {
//                 cl: /\^/,
//             },
//         };
//     }
//     rest.entity = markup.entity;

//     for (let c = 6; c >= 1; c -= 1) {
//         grammars.main[`h${c}`].inside.rest = rest;
//     }
//     grammars.main['h1 alt'].inside.rest = rest;
//     grammars.main['h2 alt'].inside.rest = rest;
//     grammars.table.table.inside.rest = rest;
//     grammars.main.rest = rest;
//     grammars.list.rest = rest;
//     grammars.blockquote.blockquote.inside.rest = rest;
//     grammars.deflist.deflist.inside.rest = rest;
//     if (options.footnote) {
//         grammars.main.fndef.inside.rest = rest;
//     }

//     const restLight = {
//         code: rest.code,
//         inlinefn: rest.inlinefn,
//         fn: rest.fn,
//         link: rest.link,
//         linkref: rest.linkref,
//     };
//     rest.strong.inside.rest = restLight;
//     rest.em.inside.rest = restLight;
//     if (options.del) {
//         rest.del.inside.rest = restLight;
//     }
//     if (options.mark) {
//         rest.mark.inside.rest = restLight;
//     }

//     const inside = {
//         code: rest.code,
//         comment: rest.comment,
//         tag: rest.tag,
//         strong: rest.strong,
//         em: rest.em,
//         del: rest.del,
//         sub: rest.sub,
//         sup: rest.sup,
//         entity: markup.entity,
//     };
//     rest.link.inside['cl cl-underlined-text'].inside = inside;
//     rest.linkref.inside['cl cl-underlined-text'].inside = inside;

//     // Wrap any other characters to allow paragraph folding
//     Object.entries(grammars).forEach(([, grammar]) => {
//         grammar.rest = grammar.rest || {};
//         grammar.rest.p = /.+/;
//     });

//     return grammars;

// })()

export default function Editor() {
    const [content, setContent] = useState<string>('');

    const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
        const cursorPosition = saveCursorPosition();
        setContent(e.target.textContent!)
        restoreCursorPosition(cursorPosition!);
    }
    const result = useMemo(() => md.render(content), [content]);

    // Function to save cursor position
    const saveCursorPosition = () => {
        const selection = window.getSelection()!;
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            return range.cloneRange();
        }
        return null;
    };

    // Function to restore cursor position
    const restoreCursorPosition = (cursorPosition: Range) => {
        console.log('==== cursorPosition', cursorPosition);
        if (cursorPosition) {
            const selection = window.getSelection()!;
            selection.removeAllRanges();
            selection.addRange(cursorPosition);
        }
    };


    // useEffect(() => {
    //     function saveSelection() {
    //         const selection = window.getSelection();
    //         console.log('==== selection', selection);
    //         // let range = selection.rangeCount && selection.getRangeAt(0);
    //         // if (range) {
    //         //     if (
    //         //         /* eslint-disable no-bitwise */
    //         //         !(editorSvc.previewElt.compareDocumentPosition(range.startContainer) &
    //         //             window.Node.DOCUMENT_POSITION_CONTAINED_BY) ||
    //         //         !(editorSvc.previewElt.compareDocumentPosition(range.endContainer) &
    //         //             window.Node.DOCUMENT_POSITION_CONTAINED_BY)
    //         //         /* eslint-enable no-bitwise */
    //         //     ) {
    //         //         range = null;
    //         //     }
    //         // }
    //         // if (editorSvc.previewSelectionRange !== range) {
    //         //     let previewSelectionStartOffset;
    //         //     let previewSelectionEndOffset;
    //         //     if (range) {
    //         //         const startRange = document.createRange();
    //         //         startRange.setStart(editorSvc.previewElt, 0);
    //         //         startRange.setEnd(range.startContainer, range.startOffset);
    //         //         previewSelectionStartOffset = `${startRange}`.length;
    //         //         previewSelectionEndOffset = previewSelectionStartOffset + `${range}`.length;
    //         //         const editorStartOffset = editorSvc.getEditorOffset(previewSelectionStartOffset);
    //         //         const editorEndOffset = editorSvc.getEditorOffset(previewSelectionEndOffset);
    //         //         if (editorStartOffset != null && editorEndOffset != null) {
    //         //             editorSvc.clEditor.selectionMgr.setSelectionStartEnd(
    //         //                 editorStartOffset,
    //         //                 editorEndOffset,
    //         //             );
    //         //         }
    //         //     }
    //         //     editorSvc.previewSelectionRange = range;
    //         //     editorSvc.$emit('previewSelectionRange', editorSvc.previewSelectionRange);
    //         // }
    //     }
    //     window.addEventListener('keyup', saveSelection);
    //     window.addEventListener('mouseup', saveSelection);
    //     window.addEventListener('focusin', saveSelection);
    //     window.addEventListener('contextmenu', saveSelection);

    //     return () => {
    //         window.removeEventListener('keyup', saveSelection)
    //         window.removeEventListener('mouseup', saveSelection)
    //         window.removeEventListener('focusin', saveSelection)
    //         window.removeEventListener('contextmenu', saveSelection)
    //     }
    // }, [])

    console.log('==== ', prismjs.highlight(content, prismjs.languages.markdown, 'markdown'));

    const mdHightlighted = useMemo(() => prismjs.highlight(content, prismjs.languages.markdown, 'markdown'), [content])

    return <div className='flex'>
        <div contentEditable className='flex-1' onInput={handleContentChange} dangerouslySetInnerHTML={{ __html: mdHightlighted }} />
        <div className='flex-1' dangerouslySetInnerHTML={{ __html: result }} />
    </div>
}