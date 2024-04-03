import markdownit from 'markdown-it'
const md = markdownit()

export default function Editor() {
    const result = md.render('# markdown-it rulezz!');
    return <div className='flex'>
        <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
}