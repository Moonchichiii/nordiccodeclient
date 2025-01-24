import { FileText, Lock } from 'lucide-react';

const Documents = () => {
  const isProjectActive = false; // Replace with actual project status check

  if (!isProjectActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] max-w-md mx-auto text-center p-6">
        <Lock className="h-12 w-12 text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Documents Unavailable</h2>
        <p className="text-gray-400">
          Document sharing will be available after completing project setup and initial payment.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Project Documents</h1>
      
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <FileText className="h-6 w-6 text-yellow-500 mr-4" />
            <div className="flex-1">
              <h3 className="font-medium">{doc.name}</h3>
              <p className="text-sm text-gray-400">{doc.uploadDate}</p>
            </div>
            <button className="text-yellow-500 hover:text-yellow-400">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Documents;