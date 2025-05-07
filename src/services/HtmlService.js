export default class HtmlService {
    static sanitize(unsafeHtml) {
        if (!unsafeHtml || typeof unsafeHtml !== 'string') {
            return '';
        }
    
        const parser = new DOMParser();
        const doc = parser.parseFromString(unsafeHtml, 'text/html');
        console.log('Parsed HTML:', doc.body.innerHTML);
    
        // Detect parsing errors (DOMParser creates a <parsererror> element)
        const parserError = doc.querySelector('parsererror');
        if (parserError || !doc.body) {
            console.warn('Failed to parse HTML:', unsafeHtml);
            return '';
        }
    
        const allowedTags = [
            'p', 'ul', 'ol', 'li', 'strong', 'em', 'br',
            'hr', 'h1', 'h2', 'h3', 'blockquote', 'code', 'pre',
        ];
        const allowedAttributes = ['href', 'src', 'alt', 'title'];
    
        function walk(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
    
                if (!allowedTags.includes(tag)) {
                    const fragment = document.createDocumentFragment();
                    while (node.firstChild) {
                        fragment.appendChild(node.firstChild);
                    }
                    node.replaceWith(fragment);
                } else {
                    [...node.attributes].forEach(attr => {
                        if (!allowedAttributes.includes(attr.name.toLowerCase())) {
                            node.removeAttribute(attr.name);
                        }
                    });
                }
            }
    
            [...node.childNodes].forEach(walk);
        }
        
        walk(doc.body);
        console.log('Sanitized HTML after walk:', doc.body);
        
        return doc.body.innerHTML;
    }
    
}
