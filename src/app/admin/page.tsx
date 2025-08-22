"use client";

import { useEffect, useState } from "react";
import Table from "@/components/tables/Table";
import Dropdown, { DropdownOption } from "@/components/atoms/Dropdown";
import Pagination from "@/components/molecules/Pagination";
import { RequestStatus } from "@/lib/types/request";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

interface ItemRequest {
  id: number;
  requestorName: string;
  itemRequested: string;
  requestCreatedDate: string;
  lastEditedDate: string | null;
  status: RequestStatus;
}

const statusOptions: DropdownOption[] = [
  { label: "Pending", value: RequestStatus.PENDING },
  { label: "Approved", value: RequestStatus.APPROVED },
  { label: "Completed", value: RequestStatus.COMPLETED },
  { label: "Rejected", value: RequestStatus.REJECTED },
];

export default function ItemRequestsPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [batchStatus, setBatchStatus] = useState<string>("");
  const [batchLoading, setBatchLoading] = useState(false);
  const [requests, setRequests] = useState<ItemRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeTab, setActiveTab] = useState<RequestStatus | "all">("all");

  const fetchRequests = async (pageNum = 1, status: RequestStatus | "all" = "all") => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/mock/request?page=${pageNum}`;
      if (status !== "all") {
        url += `&status=${status}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await res.json();
      setRequests(data);
      // Try to get total count from headers or fallback to estimate
      const total = res.headers.get("x-total-count");
      setTotalRecords(total ? Number(total) : pageNum * PAGINATION_PAGE_SIZE + (data.length === PAGINATION_PAGE_SIZE ? PAGINATION_PAGE_SIZE : data.length));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(page, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab]);

  const handleStatusChange = async (id: number, status: string) => {
    setError(null);
    try {
      const res = await fetch("/api/mock/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id, status}),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      fetchRequests(page, activeTab);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  const columns = [
    {
      key: "select",
      label: "",
      type: "text" as const,
    },
    { key: "requestorName", label: "Requestor", type: "text" as const },
    { key: "itemRequested", label: "Item", type: "text" as const },
    {
      key: "status",
      label: "Status",
      type: "dropdown" as const,
      options: statusOptions,
    },
    {
      key: "lastEditedDate",
      label: "Last Edited",
      type: "date" as const,
    },
    {
      key: "requestCreatedDate",
      label: "Created",
      type: "date" as const,
    },
  ];

  const tabOptions: { label: string; value: RequestStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: RequestStatus.PENDING },
    { label: "Approved", value: RequestStatus.APPROVED },
    { label: "Completed", value: RequestStatus.COMPLETED },
    { label: "Rejected", value: RequestStatus.REJECTED },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8 flex flex-col gap-6">
      
      <h2 className="font-bold text-xl">Item Requests</h2>
      <div className="flex gap-2 mb-2">
        {tabOptions.map(tab => (
          <button
            key={tab.value}
            className={`px-3 py-1 rounded border text-xs font-semibold ${activeTab === tab.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => { setActiveTab(tab.value); setPage(1); }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <Dropdown
              options={statusOptions}
              value={batchStatus}
              onChange={setBatchStatus}
              className="min-w-[120px]"
            />
            <button
              className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold disabled:opacity-50"
              disabled={selectedIds.length === 0 || !batchStatus || batchLoading}
              onClick={async () => {
                setBatchLoading(true);
                setError(null);
                try {
                  await Promise.all(
                    selectedIds.map(id =>
                      fetch("/api/mock/request", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, status: batchStatus }),
                      })
                    )
                  );
                  setSelectedIds([]);
                  setBatchStatus("");
                  fetchRequests(page, activeTab);
                } catch (err: any) {
                  setError("Batch update failed");
                } finally {
                  setBatchLoading(false);
                }
              }}
            >
              Set Status for Selected
            </button>
            <span className="text-xs text-gray-500">{selectedIds.length} selected</span>
          </div>
          <Table
            columns={columns}
            data={requests.map(r => ({ ...r, select: undefined }))}
            onDropdownChange={(rowId, value) => handleStatusChange(Number(rowId), value)}
            // Custom row rendering for checkboxes
            className=""
            // @ts-ignore
            renderCell={(col, row) => {
              if (col.key === "select") {
                return (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={e => {
                      setSelectedIds(ids =>
                        e.target.checked
                          ? [...ids, row.id]
                          : ids.filter(id => id !== row.id)
                      );
                    }}
                  />
                );
              }
              return undefined;
            }}
          />
          <div className="mt-4 flex justify-end">
            <Pagination
              pageNumber={page}
              pageSize={PAGINATION_PAGE_SIZE}
              totalRecords={totalRecords}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
