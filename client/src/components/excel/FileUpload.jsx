import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadExcelFile } from '../../store/slices/excelSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';

const FileUpload = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { loading } = useSelector((state) => state.excel);
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (file) => {
    // Check if file is an Excel file
    const validExcelTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      '.xls',
      '.xlsx'
    ];
    
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validExcelTypes.includes(fileType) && !['xls', 'xlsx'].includes(fileExtension)) {
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: 'Please upload a valid Excel file (.xls or .xlsx)'
      }));
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: 'File size exceeds 10MB limit'
      }));
      return;
    }
    
    setSelectedFile(file);
    
    // Create file preview
    setFilePreview({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || `Excel (.${fileExtension})`,
      lastModified: new Date(file.lastModified).toLocaleDateString()
    });
  };

  // Format file size to readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      dispatch(addNotification({
        id: uuidv4(),
        type: 'warning',
        message: 'Please select a file to upload'
      }));
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Simulate upload progress (in a real app, this would come from the server)
      const progressInterval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 300);

      // Upload file
      await dispatch(uploadExcelFile(formData)).unwrap();
      
      // Clear progress after upload completes
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setFilePreview(null);
        setUploadProgress(0);
        
        // Show success notification
        dispatch(addNotification({
          id: uuidv4(),
          type: 'success',
          message: 'File uploaded successfully!'
        }));
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
      
      // Show error notification
      dispatch(addNotification({
        id: uuidv4(),
        type: 'error',
        message: error.message || 'Failed to upload file. Please try again.'
      }));
    }
  };

  // Handle cancel upload
  const handleCancel = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
          Upload Excel File
        </h2>
        
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-2">
              Drag & Drop your Excel file here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Supports .xls, .xlsx (Max 10MB)
            </p>
          </div>
        </div>

        {/* File Preview */}
        {filePreview && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className="p-3 bg-green-100 dark:bg-green-800 rounded-md text-green-500 dark:text-green-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {filePreview.name}
                </h4>
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{filePreview.size}</span>
                  <span>•</span>
                  <span>{filePreview.type}</span>
                  <span>•</span>
                  <span>Last modified: {filePreview.lastModified}</span>
                </div>
              </div>
              <button
                type="button"
                className="ml-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                <span className="sr-only">Remove file</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={!selectedFile || loading || uploadProgress > 0}
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
