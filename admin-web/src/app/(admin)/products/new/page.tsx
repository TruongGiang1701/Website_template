"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Save, Upload, X, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApiJson } from "@/lib/admin-api";
import { resolveMediaUrl } from "@/lib/media-url";
import { AdminCategoryListItem } from "@/types/admin-api";

export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(true);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category_id: "",
    price_vnd: 0,
    description: "",
    status: "active",
    featured: false,
  });

  useEffect(() => {
    async function loadCats() {
      const res = await adminApiJson<AdminCategoryListItem[]>("/api/admin/categories");
      if (res.ok) {
        setCategories(res.data.map(c => ({ value: c.id, label: c.name })));
      }
      setFetchingCats(false);
    }
    void loadCats();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 4) {
      toast("Chỉ được tải lên tối đa 4 ảnh.", "error");
      return;
    }

    const body = new FormData();
    body.append("file", file);

    const res = await adminApiJson<{ url: string }>("/api/admin/upload", {
      method: "POST",
      body,
    });

    if (res.ok) {
      setImages((prev) => [...prev, res.data.url]);
      toast("Tải ảnh lên thành công!", "success");
    } else {
      toast(res.error, "error");
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast("Vui lòng nhập tên sản phẩm.", "error");
      return;
    }
    if (!formData.category_id) {
      toast("Vui lòng chọn danh mục.", "error");
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      images: images.map((url, i) => ({ url, sort_order: i })),
    };

    const res = await adminApiJson("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast("Đã thêm sản phẩm mới thành công!", "success");
      router.push("/products");
    } else {
      toast(res.error, "error");
    }
    setLoading(false);
  };

  const statuses = [
    { value: "active", label: "Hoạt động" },
    { value: "draft", label: "Bản nháp" },
    { value: "archived", label: "Lưu trữ" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleUpload} 
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
            <p className="text-sm text-muted-foreground">Tạo và cấu hình món ăn mới cho thực đơn.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="outline">Hủy</Button>
          </Link>
          <Button onClick={handleSave} isLoading={loading} className="gap-2">
            <Save className="h-4 w-4" />
            Lưu sản phẩm
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="Tên sản phẩm" 
                placeholder="VD: Cơm Gà Hải Nam" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required 
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Select 
                  label="Danh mục" 
                  options={categories} 
                  placeholder={fetchingCats ? "Đang tải..." : "Chọn danh mục"} 
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required 
                />
                <Input 
                  label="Giá bán (VND)" 
                  type="number" 
                  placeholder="0" 
                  value={formData.price_vnd}
                  onChange={(e) => setFormData({ ...formData, price_vnd: parseInt(e.target.value) || 0 })}
                  required 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Mô tả sản phẩm</label>
                <textarea 
                  className="min-h-[150px] w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Mô tả hương vị, nguyên liệu, quy cách đóng gói..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media / Images */}
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-4">
                {images.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl border border-border overflow-hidden">
                    <img src={resolveMediaUrl(img)} alt="Product" className="h-full w-full object-cover" />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white items-center justify-center hidden group-hover:flex"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 py-0.5 text-[10px] text-white text-center font-medium">
                        Ảnh bìa
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 4 && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/10 hover:border-primary/50 hover:bg-secondary/20 transition-all"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Tải ảnh lên</span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-start gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100 italic text-xs text-blue-700">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Bạn có thể tải lên tối đa 4 hình ảnh (PNG, JPG). Ảnh đầu tiên sẽ được dùng làm ảnh bìa.</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái & Hiển thị</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                label="Trình trạng" 
                options={statuses} 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
              <div className="pt-2">
                <Input label="Số lượng tồn kho" type="number" defaultValue="1" hint="0 có nghĩa là sản phẩm đã hết hàng" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Cấu hình bổ sung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="featured" 
                  className="h-4 w-4 rounded border-border" 
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <label htmlFor="featured">Sản phẩm nổi bật (Trang chủ)</label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
