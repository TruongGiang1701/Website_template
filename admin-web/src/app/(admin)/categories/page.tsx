"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ChevronRight, Layers, Layout, Monitor } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { adminApiJson } from "@/lib/admin-api";
import { AdminCategoryListItem } from "@/types/admin-api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CategoriesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AdminCategoryListItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryListItem | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", sort_order: 0, is_active: true, parent_id: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminApiJson<AdminCategoryListItem[]>("/api/admin/categories");
    if (res.ok) {
      setItems(res.data);
    } else {
      toast(res.error, "error");
      if (res.status === 401) router.replace("/login");
    }
    setLoading(false);
  }, [router, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const rootCategories = useMemo(() => items.filter(c => !c.parent_id), [items]);
  
  const getChildren = useCallback((parentId: string) => {
    return items.filter(c => c.parent_id === parentId);
  }, [items]);

  const handleOpenModal = (category?: AdminCategoryListItem, parentId?: string) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name, 
        slug: category.slug, 
        sort_order: category.sort_order, 
        is_active: category.is_active,
        parent_id: category.parent_id || ""
      });
    } else {
      setEditingCategory(null);
      setFormData({ 
        name: "", 
        slug: "", 
        sort_order: 0, 
        is_active: true, 
        parent_id: parentId || "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast("Vui lòng nhập tên danh mục.", "error");
      return;
    }
    
    setSaving(true);
    const path = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories";
    const method = editingCategory ? "PATCH" : "POST";
    
    const payload = {
      ...formData,
      parent_id: formData.parent_id || null
    };

    const res = await adminApiJson<AdminCategoryListItem>(path, {
      method,
      body: JSON.stringify(payload),
    });
    
    setSaving(false);
    if (res.ok) {
      toast(`Đã ${editingCategory ? "cập nhật" : "tạo mới"} danh mục thành công!`, "success");
      setIsModalOpen(false);
      void load();
    } else {
      toast(res.error, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này? Toàn bộ danh mục con và sản phẩm liên quan có thể bị ảnh hưởng.")) return;
    
    const res = await adminApiJson(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Đã xóa danh mục thành công!", "success");
      void load();
    } else {
      toast(res.error, "error");
    }
  };

  const parentOptions = useMemo(() => {
    return [
      { value: "", label: "Không có (Danh mục gốc)" },
      ...rootCategories.map(c => ({ value: c.id, label: c.name }))
    ];
  }, [rootCategories]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Quản lý Danh mục"
        description="Tổ chức thực đơn theo cấu trúc cây. Phân tách rõ rệt giữa Website và Landing Page."
        actions={
          <Button className="gap-2" onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4" />
            Thêm danh mục gốc
          </Button>
        }
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {rootCategories.map((root) => {
            const children = getChildren(root.id);
            const isWebsite = root.name.toLowerCase().includes("website");
            const isLanding = root.name.toLowerCase().includes("landing");
            
            return (
              <Card key={root.id} className="overflow-hidden border-2 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className={cn(
                  "border-b py-4",
                  isWebsite ? "bg-blue-50/50" : isLanding ? "bg-purple-50/50" : "bg-muted/30"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-xl text-white shadow-sm",
                        isWebsite ? "bg-blue-500" : isLanding ? "bg-purple-500" : "bg-slate-500"
                      )}>
                        {isWebsite ? <Monitor className="size-5" /> : isLanding ? <Layout className="size-5" /> : <Layers className="size-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{root.name}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono">{root.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(root)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(root.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {children.length > 0 ? (
                      children.sort((a,b) => a.sort_order - b.sort_order).map((child) => (
                        <div key={child.id} className="group flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <ChevronRight className="size-3 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{child.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{child.slug}</p>
                            </div>
                            <Badge variant={child.is_active ? "success" : "outline"} className="px-1.5 py-0 text-[9px] h-4">
                              {child.is_active ? "Mở" : "Ẩn"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[11px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded">
                               {child.product_count} SP
                             </span>
                             <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(child)}>
                                 <Edit2 className="h-3.5 w-3.5" />
                               </Button>
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(child.id)}>
                                 <Trash2 className="h-3.5 w-3.5" />
                               </Button>
                             </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-sm text-muted-foreground italic">
                        Chưa có danh mục con.
                      </div>
                    )}
                    <button 
                      onClick={() => handleOpenModal(undefined, root.id)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium text-primary hover:bg-primary/5 transition-colors border-t border-dashed border-border mt-auto"
                    >
                      <Plus className="size-3.5" />
                      Thêm mục con cho {root.name}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {rootCategories.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
              <Layers className="size-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Chưa có danh mục nào được tạo.</p>
              <Button variant="ghost" onClick={() => handleOpenModal()} className="mt-2 text-primary underline-offset-4 hover:underline">
                Tạo danh mục đầu tiên ngay
              </Button>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Input 
            label="Tên danh mục" 
            placeholder="VD: Doanh nghiệp, Làm đẹp..." 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input 
            label="Slug (Liên kết)" 
            placeholder="doanh-nghiep (để trống sẽ tự tạo)" 
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
          <Select 
            label="Danh mục cha" 
            options={parentOptions}
            value={formData.parent_id}
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Thứ tự hiển thị" 
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Button 
                variant={formData.is_active ? "primary" : "outline"}
                className="w-full justify-start"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              >
                {formData.is_active ? "Đang hoạt động" : "Đang tạm ẩn"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
