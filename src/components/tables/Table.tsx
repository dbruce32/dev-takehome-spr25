import React from 'react';
import Dropdown, { DropdownOption } from '../atoms/Dropdown';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'dropdown' | 'date';
  options?: DropdownOption[];
}

export interface TableRow {
  [key: string]: any;
}

export interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  onDropdownChange?: (rowId: string, value: string) => void;
  className?: string;
  renderCell?: (col: TableColumn, row: TableRow) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ columns, data, onDropdownChange, className, renderCell }) => {
  return (
    <div className={`overflow-x-auto w-full ${className || ''}`}>
      <table className="min-w-full border border-gray-300 rounded-xl shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="p-2 text-left text-xs font-semibold text-gray-700">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t">
              {columns.map(col => (
                <td key={col.key} className="p-2 text-xs">
                  {(() => {
                    // Case 1: Custom renderCell function
                    if (renderCell && renderCell(col, row) !== undefined) {
                      return renderCell(col, row);
                    }

                    // Case 2: Dropdown type
                    if (col.type === "dropdown" && col.options) {
                      return (
                        <Dropdown
                          options={col.options}
                          value={row[col.key]}
                          onChange={val =>
                            onDropdownChange && onDropdownChange(row.id, val)
                          }
                        />
                      );
                    }

                    // Case 3: Date type
                    if (col.type === "date") {
                      return (
                        <span>
                          {row[col.key]
                            ? new Date(row[col.key]).toLocaleDateString()
                            : "-"}
                        </span>
                      );
                    }

                    // Default case: Just render value
                    return <span>{row[col.key]}</span>;
                  })()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;