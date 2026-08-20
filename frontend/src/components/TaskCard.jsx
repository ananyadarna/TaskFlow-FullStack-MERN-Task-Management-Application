import React from 'react';
import { Calendar, Paperclip, Edit3, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { WeatherBadge } from './WeatherBadge';

export const TaskCard = ({ task, onEdit, onDelete, onStatusToggle }) => {
  // Format due date cleanly
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'DONE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  // Priority badge styling helper
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <span className="px-2 py-0.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded">LOW</span>;
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Header: Title, Status, Priority */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className={`font-semibold text-lg text-gray-900 ${task.status === 'DONE' ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
        </div>

        {/* Task Description */}
        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Meta & Actions */}
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Due Date */}
          {formattedDueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{formattedDueDate}</span>
            </div>
          )}

          {/* Weather Badge */}
          {task.location && <WeatherBadge location={task.location} weather={task.weather} />}

          {/* Cloudinary File Attachment */}
          {task.fileUrl && (
            <a
              href={task.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attachment</span>
            </a>
          )}
        </div>

        {/* Card Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onStatusToggle(task)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
              task.status === 'DONE'
                ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                : 'border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            {task.status === 'DONE' ? 'Mark Pending' : 'Mark Complete'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
