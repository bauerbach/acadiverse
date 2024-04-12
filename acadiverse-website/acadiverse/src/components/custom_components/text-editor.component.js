import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import emoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import { Icon, Button, Container, Checkbox } from "semantic-ui-react";

export default function TextEditor(props) {
    const [value, setValue] = useState("");
    const [previewEnabled, setPreviewEnabled] = useState(false);
    const [previewDisplayed, setPreviewDisplayed] = useState(false);

    useEffect(() => {
        setValue(props.value);
        setPreviewEnabled(props.previewEnabled);
        if(props.enablePreview && props.displayPreviewByDefault) {
            setPreviewDisplayed(true);
        }
    }, []);

    function InsertFormatting(type) {
        
    }

    return (
        <Container>
            {props.showToolbar === true? <Container>
                <Button icon aria-label="Bold">
                    <Icon name="bold"/>
                </Button>
                <Button icon aria-label="Italics">
                    <Icon name="italic"/>
                </Button>
                <Button icon aria-label="Strikethrough">
                    <Icon name="strikethrough"/>
                </Button>
            </Container> : null}
            <textarea value={value} onChange={(e, value) => {
                setValue(e.target.value);
                props.onChange(e.target.value);
            }} />
            {previewEnabled? <Checkbox label="Show Preview" checked={previewDisplayed} onChange={(e, data) => {setPreviewDisplayed(data.checked);}} />: null}
            {previewDisplayed?<h2>Preview</h2> : null}
            <hr />
            {previewEnabled && previewDisplayed? <ReactMarkdown children={value} remarkPlugins={[remarkGfm, emoji]} rehypePlugins={[rehypeRaw]} /> : null}
        </Container>
    )
}