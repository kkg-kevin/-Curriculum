import { useState } from "react";
import { Link } from "react-router";
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Users, Archive, BookOpen } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getCurriculums } from "../lib/curriculumStorage";

export function CurriculumListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [curriculums] = useState(() => getCurriculums());
  const filteredCurriculums = curriculums.filter((curriculum) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    return [curriculum.name, curriculum.code, curriculum.description]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className="min-h-full">
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Curriculum Management</h1>
              <p className="text-sm text-slate-600 mt-1">Create and manage reusable curriculum templates</p>
            </div>
            <Link
              to="/curriculums/create"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create Curriculum
            </Link>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search curriculums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 font-medium transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCurriculums.map((curriculum) => (
            <div
              key={curriculum.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{curriculum.name}</h3>
                    <span className={`
                      px-2.5 py-1 rounded-lg text-xs font-medium
                      ${curriculum.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                      }
                    `}>
                      {curriculum.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{curriculum.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{curriculum.code}</span>
                    <span>Version {curriculum.version}</span>
                  </div>
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="min-w-48 bg-white rounded-xl shadow-lg border border-slate-200 p-1 z-50">
                      <DropdownMenu.Item asChild>
                        <Link
                          to={`/curriculums/${curriculum.id}/edit`}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                        >
                          <Eye className="w-4 h-4" />
                          Open Curriculum
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          to={`/curriculums/${curriculum.id}/edit`}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          to={`/curriculums/${curriculum.id}/assign`}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer outline-none"
                        >
                          <Users className="w-4 h-4" />
                          Assign to School
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />
                      <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer outline-none">
                        <Archive className="w-4 h-4" />
                        Archive
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{curriculum.schools}</span>
                  <span>schools using</span>
                </div>
                <span className="text-sm text-slate-500">Created {curriculum.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredCurriculums.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No curriculums yet</h3>
            <p className="text-slate-600 mb-6">Get started by creating your first curriculum template</p>
            <Link
              to="/curriculums/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B50B8] hover:bg-[#2563EB] text-white rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Curriculum
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
