// Progress bar component
const ProgressBar = React.memo(({value}) => {
    const [width, setWidth] = React.useState('0%');
    
    React.useEffect(() => {
        setWidth(`${value}%`);
    }, [value, setWidth]); 
    return (
        <div className="form-progress-bar-wrapper">
            <div className="form-progress-bar" style={{width}}></div>
        </div>
    );
});
// Label component
const Label = React.memo((props) => <label {...props} />);
// Input component
const Input = React.memo((props) => <input {...props} />);
// Select component
const Select = React.memo(({options, ...props}) => (
    <select {...props}>
        { options.map(option => <option key={option} value= {option}>{option}</option>)}
    </select>
));
const options = { 
    documentType: [
        '', 'Plain', 'PDF'
    ],
    category: [
        '', 'Audit', 'Application', 'Other'
    ]
};

const App = () => {
    const [formValid, setFormValid] = React.useState({});
    const [progress, setProgress] = React.useState(0);
    const [documentType, setDocumentType] = React.useState('');
    const [documentName, setDocumentName] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [email, setEmail] = React.useState('');  
    
    const handleOnChange = setter => ({target}) => {
        setFormValid(ps => ({...ps, [target.id]: target.reportValidity()}));
        return setter(target.value);
    };  
    
    React.useEffect(() => {
        const newProgress = Object.values(formValid).reduce((a, n) => n ? a + 25 :  a, 0 );
        setProgress(newProgress);
    },[formValid, setProgress]);
    
    return (
        <React.Fragment>
            <div>
                Form completion
                <ProgressBar value={progress} />
            </div>
            <hr/>
            <form className="form">
                <div className="fc-container">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select id="documentType" required value={documentType} onChange={handleOnChange(setDocumentType)} options={options.documentType} />
                </div>
                <div className="fc-container">
                    <Label htmlFor="documentName">Document Name</Label>
                    <Input type="text" required pattern="^.{2,32}$" minLength={2} id="documentName" value={documentName} onChange={handleOnChange(setDocumentName)} />
                </div>
                <div className="fc-container">
                    <Label htmlFor="category">Category</Label>
                    <Select id="category" required options={options.category} value={category} onChange={handleOnChange(setCategory)}  />
                </div>
                <div className="fc-container">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" required id="email" value={email} onChange={handleOnChange(setEmail)}  />
                </div>
            </form>
        </React.Fragment>
    );
};

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
