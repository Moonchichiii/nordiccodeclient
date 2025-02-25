// TemplateInteractionHandler.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Edit2, Plus, Trash, Settings, Image, Type, Layout } from 'lucide-react';

interface ElementInfo {
  id: string;
  element: HTMLElement;
  type: string;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface TemplateInteractionHandlerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isEditable?: boolean;
  onElementEdit?: (elementInfo: ElementInfo, content: string) => void;
  onElementDelete?: (elementInfo: ElementInfo) => void;
  onElementAdd?: (position: { top: number; left: number }, type: string) => void;
}

const ToolbarButton: React.FC<{
  icon: React.ComponentType<any>;
  tooltip: string;
  onClick: () => void;
}> = ({ icon: Icon, tooltip, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200"
    title={tooltip}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export const TemplateInteractionHandler: React.FC<TemplateInteractionHandlerProps> = ({
  containerRef,
  isEditable = false,
  onElementEdit,
  onElementDelete,
  onElementAdd,
}) => {
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
  const [hoverElement, setHoverElement] = useState<HTMLElement | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMenuPosition, setAddMenuPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  // Find editable elements in the container
  const findEditableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const editableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span',
      'div[data-editable="true"]', 'section[data-editable="true"]',
      'img', 'button', '.editable'
    ];
    
    return Array.from(
      containerRef.current.querySelectorAll(editableSelectors.join(','))
    ) as HTMLElement[];
  }, [containerRef]);

  // Handle mouse over on editable elements
  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (!isEditable) return;
    
    const editableElements = findEditableElements();
    const target = e.target as HTMLElement;
    
    // Check if the target is an editable element
    const isEditable = editableElements.some(el => el.contains(target) || el === target);
    
    if (isEditable) {
      setHoverElement(target);
    } else {
      setHoverElement(null);
    }
  }, [isEditable, findEditableElements]);

  // Handle mouse click on editable elements
  const handleClick = useCallback((e: MouseEvent) => {
    if (!isEditable) return;
    
    const editableElements = findEditableElements();
    const target = e.target as HTMLElement;
    
    // Check if we clicked on an editable element
    const clickedElement = editableElements.find(el => el.contains(target) || el === target);
    
    if (clickedElement) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get element position for the overlay
      const rect = clickedElement.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };
      
      setSelectedElement({
        id: clickedElement.id || `element-${Date.now()}`,
        element: clickedElement,
        type: clickedElement.tagName.toLowerCase(),
        position: {
          top: rect.top - containerRect.top,
          left: rect.left - containerRect.left,
          width: rect.width,
          height: rect.height,
        },
      });
    } else {
      // If we clicked outside, deselect
      setSelectedElement(null);
    }
  }, [isEditable, findEditableElements, containerRef]);

  // Handle click outside to deselect 
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        overlayRef.current && 
        !overlayRef.current.contains(e.target as Node) &&
        containerRef.current && 
        !containerRef.current.contains(e.target as Node)
      ) {
        setSelectedElement(null);
        setShowAddMenu(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [containerRef]);

  // Set up mouse events when editable mode changes
  useEffect(() => {
    if (isEditable && containerRef.current) {
      containerRef.current.addEventListener('mouseover', handleMouseOver);
      containerRef.current.addEventListener('click', handleClick);
      
      // Set container as relative for positioning
      containerRef.current.style.position = 'relative';
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseover', handleMouseOver);
        containerRef.current.removeEventListener('click', handleClick);
      }
    };
  }, [isEditable, containerRef, handleMouseOver, handleClick]);

  // Handle right-click to show add menu
  useEffect(() => {
    if (!isEditable || !containerRef.current) return;
    
    const handleContextMenu = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        setAddMenuPosition({
          top: e.clientY - containerRect.top,
          left: e.clientX - containerRect.left,
        });
        
        setShowAddMenu(true);
      }
    };
    
    containerRef.current.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      containerRef.current?.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isEditable, containerRef]);

  // Function to handle element editing
  const handleEdit = useCallback(() => {
    if (!selectedElement) return;
    
    // Get current content (text or src for images)
    let content = selectedElement.type === 'img'
      ? (selectedElement.element as HTMLImageElement).src
      : selectedElement.element.innerText;
      
    onElementEdit?.(selectedElement, content);
  }, [selectedElement, onElementEdit]);

  // Function to handle element deletion
  const handleDelete = useCallback(() => {
    if (!selectedElement) return;
    onElementDelete?.(selectedElement);
    setSelectedElement(null);
  }, [selectedElement, onElementDelete]);

  // Function to handle adding a new element
  const handleAddElement = useCallback((type: string) => {
    onElementAdd?.(addMenuPosition, type);
    setShowAddMenu(false);
  }, [addMenuPosition, onElementAdd]);

  // Only render the UI when in editable mode
  if (!isEditable) return null;

  return (
    <>
      {/* Selected element overlay */}
      {selectedElement && containerRef.current && (
        createPortal(
          <div
            ref={overlayRef}
            className="absolute border-2 border-blue-500 pointer-events-none z-10"
            style={{
              top: `${selectedElement.position.top}px`,
              left: `${selectedElement.position.left}px`,
              width: `${selectedElement.position.width}px`,
              height: `${selectedElement.position.height}px`,
            }}
          >
            {/* Action toolbar */}
            <div 
              className="absolute -top-10 left-0 flex items-center gap-1 p-1 bg-blue-500 rounded-t-md pointer-events-auto"
            >
              <ToolbarButton 
                icon={Edit2} 
                tooltip="Edit content" 
                onClick={handleEdit} 
              />
              <ToolbarButton 
                icon={Settings} 
                tooltip="Edit properties" 
                onClick={() => {}} 
              />
              <ToolbarButton 
                icon={Trash} 
                tooltip="Delete element" 
                onClick={handleDelete} 
              />
            </div>
          </div>,
          containerRef.current
        )
      )}
      
      {/* Hover element highlight */}
      {hoverElement && containerRef.current && !selectedElement && (
        createPortal(
          <div
            className="absolute border border-blue-300 pointer-events-none z-5"
            style={{
              top: `${hoverElement.offsetTop}px`,
              left: `${hoverElement.offsetLeft}px`,
              width: `${hoverElement.offsetWidth}px`,
              height: `${hoverElement.offsetHeight}px`,
            }}
          />,
          containerRef.current
        )
      )}
      
      {/* Add new element menu */}
      {showAddMenu && containerRef.current && (
        createPortal(
          <div
            className="absolute z-20 bg-white rounded-md shadow-lg border border-gray-200 p-2 pointer-events-auto"
            style={{
              top: `${addMenuPosition.top}px`,
              left: `${addMenuPosition.left}px`,
            }}
          >
            <div className="text-sm font-medium text-gray-700 mb-2 px-2">Add Element</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleAddElement('text')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-left"
              >
                <Type className="w-4 h-4" />
                <span>Text</span>
              </button>
              <button
                onClick={() => handleAddElement('image')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-left"
              >
                <Image className="w-4 h-4" />
                <span>Image</span>
              </button>
              <button
                onClick={() => handleAddElement('button')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-left"
              >
                <Plus className="w-4 h-4" />
                <span>Button</span>
              </button>
              <button
                onClick={() => handleAddElement('section')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm text-left"
              >
                <Layout className="w-4 h-4" />
                <span>Section</span>
              </button>
            </div>
          </div>,
          containerRef.current
        )
      )}
    </>
  );
};

export default TemplateInteractionHandler;