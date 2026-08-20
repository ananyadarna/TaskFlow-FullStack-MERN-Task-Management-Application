import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

export const TaskFormModal = ({ isOpen, onClose, onSubmit, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'PENDING');
      setPriority(taskToEdit.priority || 'MEDIUM');
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
      setLocation(taskToEdit.location || '');
      setFile(null);
      setPreviewUrl(taskToEdit.fileUrl || '');
    } else {
      resetForm();
    }
  }, [taskToEdit, isOpen]);

  // Handle local file selection and create temporary object URL preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl('');
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('PENDING');
    setPriority('MEDIUM');
    setDueDate('');
    setLocation('');
    setFile(null);
    setPreviewUrl('');
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Build FormData payload for multipart file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('status', status);
      formData.append('priority', priority);
      if (dueDate) formData.append('dueDate', dueDate);
      if (location) formData.append('location', location);
      if (file) formData.append('file', file);

      await onSubmit(formData, taskToEdit?._id);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete quarterly report"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional task context..."
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (City)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Attachment (Image / PDF)
            </label>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition text-sm font-medium text-gray-700">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  <span>{file ? file.name : 'Choose File'}</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </label>
                {file && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    ✓ File Selected
                  </span>
                )}
              </div>

              {/* Live Image Preview Thumbnail inside Modal */}
              {previewUrl && (
                <div className="relative border border-gray-200 rounded-lg p-2 bg-gray-50 flex items-center gap-3">
                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Attachment Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <ImageIcon className="w-6 h-6 text-gray-400 absolute" style={{ zIndex: 0 }} />
                  </div>
                  <div className="text-xs text-gray-600 flex-1 truncate">
                    <p className="font-semibold text-gray-800">Attached Image Preview</p>
                    <p className="truncate text-gray-500">{file ? file.name : 'Cloudinary Image'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
