import { useState } from 'react';
import FormRenderer from './components/FormRenderer';
import { FormSchema, FormData } from './types'; 
import styles from './App.module.css'; 
import './App.css'; 

const exampleSchema: FormSchema = [
  { label: 'Full Name', name: 'fullName', type: 'text', required: true },
  { label: 'Age', name: 'age', type: 'number' },
  {
    label: 'Employed',
    name: 'employed',
    type: 'select',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    required: true,
  },
  {
    label: 'Company Name',
    name: 'companyName',
    type: 'text',
    conditional: (formData: FormData) => formData.employed === 'yes', 
    required: (formData: FormData) => formData.employed === 'yes', 
  },
  {
    label: 'Employment Period',
    name: 'employment_range',
    type: 'date_range',
    required: true,
  },
];

function App() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    console.log('Data received in App:', data);
    setSubmittedData(data);
  };

  return (
    <div className="App">
      <h1>FeatureByte Form Builder Assignment</h1>
      <FormRenderer schema={exampleSchema} onSubmit={handleFormSubmit} />

      {submittedData && (
        <div className={styles.submittedDataContainer}> 
          <h3>Submitted Data:</h3>
          <pre className={styles.submittedDataPre}> 
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
