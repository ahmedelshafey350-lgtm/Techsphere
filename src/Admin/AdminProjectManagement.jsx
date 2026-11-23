import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Archive,
    BarChart3,
    Check,
    Copy,
    FilePlus2,
    KeyRound,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    Upload,
    UserRoundPen,
    X,
} from "lucide-react";
import { callProjectService, uploadProjectPrivateFile } from "../Projects/marketplaceApi";
import { useLanguage } from "../i18n/language";
import "./AdminProjectManagement.css";

const emptyProject = {
    project_code: "",
    slug: "",
    category_id: "",
    title_ar: "",
    title_en: "",
    public_description_ar: "",
    public_description_en: "",
    image_url: "",
    image_source_url: "",
    image_license: "",
    image_alt_text: "",
    catalog_visible: true,
    price: "",
    currency_code: "EGP",
    difficulty: "",
    source_document: "",
    status: "draft",
};

const emptyCategory = {
    slug: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    image_url: "",
    image_alt_text: "",
    sort_order: 0,
    is_active: true,
};

function parseJson(value, label) {
    try {
        const parsed = JSON.parse(value);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error();
        }
        return parsed;
    } catch {
        throw new Error(`${label}: invalid JSON object.`);
    }
}

function getOrderRequestDetails(customerMessage) {
    if (typeof customerMessage !== "string" || !customerMessage.startsWith("{")) return null;
    try {
        const details = JSON.parse(customerMessage);
        return details?.form_version === 1 ? details : null;
    } catch {
        return null;
    }
}

function ProjectFormField({ label, value, onChange, ...props }) {
    return (
        <label className="admin-project-field">
            <span>{label}</span>
            <input value={value ?? ""} onChange={(event) => onChange(event.target.value)} {...props} />
        </label>
    );
}

export default function AdminProjectManagement() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [activeSection, setActiveSection] = useState("projects");
    const [data, setData] = useState({
        categories: [],
        projects: [],
        documents: [],
        orders: [],
        access: [],
        activationCodes: [],
    });
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [now, setNow] = useState(() => Date.now());
    const [busy, setBusy] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [projectPage, setProjectPage] = useState(1);
    const [projectForm, setProjectForm] = useState(null);
    const projectEditorRef = useRef(null);
    const [categoryForm, setCategoryForm] = useState(emptyCategory);
    const [documentProject, setDocumentProject] = useState("");
    const [documentVersion, setDocumentVersion] = useState("1.0");
    const [changelogAr, setChangelogAr] = useState("");
    const [changelogEn, setChangelogEn] = useState("");
    const [documentationJson, setDocumentationJson] = useState(
        JSON.stringify({
            idea: { ar: "", en: "" },
            manufacturing_steps: { ar: [], en: [] },
            tools: { ar: [], en: [] },
            goal_benefits: { ar: "", en: "" },
        }, null, 2),
    );
    const [privateFiles, setPrivateFiles] = useState([]);
    const [activationCode, setActivationCode] = useState("");
    const [activationCodeOrder, setActivationCodeOrder] = useState("");
    const [copiedCode, setCopiedCode] = useState(false);
    const [reassignOrderId, setReassignOrderId] = useState("");
    const [reassignEmail, setReassignEmail] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedCategoryImage, setSelectedCategoryImage] = useState(null);
    const [selectedPrivateFiles, setSelectedPrivateFiles] = useState([]);
    const [selectedImagePreview, setSelectedImagePreview] = useState("");

    useEffect(() => {
        if (!selectedImage) {
            setSelectedImagePreview("");
            return undefined;
        }
        const previewUrl = URL.createObjectURL(selectedImage);
        setSelectedImagePreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [selectedImage]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const [result, stats] = await Promise.all([
                callProjectService("admin_list"),
                callProjectService("analytics"),
            ]);
            setData({
                categories: result.categories || [],
                projects: result.projects || [],
                documents: result.documents || [],
                orders: result.orders || [],
                access: result.access || [],
                activationCodes: result.activationCodes || [],
            });
            setAnalytics(stats);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 60_000);
        return () => window.clearInterval(timer);
    }, []);

    const notifyError = (error) => {
        setErrorMessage(error?.message || (isEnglish ? "The operation failed." : "تعذر تنفيذ العملية."));
        setSuccessMessage("");
    };

    const runAction = async (label, action, successText = "") => {
        setBusy(label);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const result = await action();
            await loadData();
            if (successText) setSuccessMessage(successText);
            return result;
        } catch (error) {
            notifyError(error);
            return null;
        } finally {
            setBusy("");
        }
    };

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLocaleLowerCase(isEnglish ? "en" : "ar");
        return data.projects.filter((project) => {
            const matchesSearch = !query || [
                project.project_code,
                project.slug,
                project.title_ar,
                project.title_en,
            ].join(" ").toLocaleLowerCase(isEnglish ? "en" : "ar").includes(query);
            return matchesSearch
                && (categoryFilter === "all" || project.category_id === categoryFilter)
                && (statusFilter === "all" || project.status === statusFilter);
        });
    }, [categoryFilter, data.projects, isEnglish, search, statusFilter]);
    const projectsPerPage = 20;
    const totalProjectPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const visibleProjects = filteredProjects.slice(
        (projectPage - 1) * projectsPerPage,
        projectPage * projectsPerPage,
    );
    const hasProtectedProjects = visibleProjects.some((project) => (
        typeof project.source_document === "string"
        && project.source_document.startsWith("Inventory ID: ")
    ));
    const isProjectEditorOpen = projectForm !== null;

    useEffect(() => {
        setProjectPage(1);
    }, [search, categoryFilter, statusFilter]);

    useEffect(() => {
        if (totalProjectPages > 0 && projectPage > totalProjectPages) {
            setProjectPage(totalProjectPages);
        }
    }, [projectPage, totalProjectPages]);

    useEffect(() => {
        if (isProjectEditorOpen) {
            projectEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [isProjectEditorOpen]);

    const openProjectForm = (project = null) => {
        setSelectedImage(null);
        setProjectForm(project ? { ...project, price: project.price == null ? "" : String(project.price) } : {
            ...emptyProject,
            category_id: data.categories[0]?.id || "",
        });
    };

    const saveProject = async (event) => {
        event.preventDefault();
        if (!projectForm) return;
        setBusy("project");
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const price = projectForm.price.trim() === "" ? null : Number(projectForm.price);
            if (price !== null && (!Number.isFinite(price) || price < 0)) {
                throw new Error(isEnglish
                    ? "Enter a valid non-negative price, or leave it blank for an unpublished draft."
                    : "أدخل سعرًا صحيحًا غير سالب، أو اتركه فارغًا لحفظ المشروع كمسودة.");
            }
            if (projectForm.status === "published" && (!projectForm.catalog_visible || price === null || price <= 0)) {
                throw new Error(isEnglish
                    ? "A project must be visible in the public catalog and have a price greater than zero before going on sale."
                    : "يجب إظهار المشروع في الكتالوج العام وتحديد سعر أكبر من صفر قبل إتاحته للبيع.");
            }
            if (selectedImage && (
                !["image/jpeg", "image/png", "image/webp"].includes(selectedImage.type)
                || selectedImage.size > 5 * 1024 * 1024
            )) {
                throw new Error(isEnglish
                    ? "Choose a JPG, PNG, or WebP image no larger than 5 MB."
                    : "اختر صورة JPG أو PNG أو WebP لا يتجاوز حجمها 5 ميجابايت.");
            }
            let saved = await callProjectService("project_save", {
                project: {
                    ...projectForm,
                    price,
                    image_url: projectForm.image_url || null,
                },
            });
            setProjectForm({ ...saved.project, price: saved.project.price == null ? "" : String(saved.project.price) });
            if (selectedImage) {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result).split(",")[1]);
                    reader.onerror = () => reject(new Error(isEnglish ? "Could not read the image." : "تعذرت قراءة الصورة."));
                    reader.readAsDataURL(selectedImage);
                });
                const upload = await callProjectService("image_upload", {
                    projectId: saved.project.id,
                    contentType: selectedImage.type,
                    base64,
                });
                saved = await callProjectService("project_save", {
                    project: { ...saved.project, image_url: upload.imageUrl },
                });
            }
            setProjectForm(null);
            setSuccessMessage(isEnglish ? "Project saved." : "تم حفظ المشروع.");
            await loadData();
            if (!documentProject) setDocumentProject(saved.project.id);
        } catch (error) {
            notifyError(error);
        } finally {
            setBusy("");
        }
    };

    const saveCategory = async (event) => {
        event.preventDefault();
        setBusy("category");
        setErrorMessage("");
        setSuccessMessage("");
        try {
            if (selectedCategoryImage && (
                !["image/jpeg", "image/png", "image/webp"].includes(selectedCategoryImage.type)
                || selectedCategoryImage.size > 5 * 1024 * 1024
            )) {
                throw new Error(isEnglish
                    ? "Choose a JPG, PNG, or WebP category image no larger than 5 MB."
                    : "اختر صورة قسم بصيغة JPG أو PNG أو WebP لا يتجاوز حجمها 5 ميجابايت.");
            }
            let result = await callProjectService("category_save", { category: categoryForm });
            if (selectedCategoryImage) {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result).split(",")[1]);
                    reader.onerror = () => reject(new Error(isEnglish ? "Could not read the category image." : "تعذرت قراءة صورة القسم."));
                    reader.readAsDataURL(selectedCategoryImage);
                });
                const upload = await callProjectService("image_upload", {
                    categoryId: result.category.id,
                    contentType: selectedCategoryImage.type,
                    base64,
                });
                result = await callProjectService("category_save", {
                    category: { ...result.category, image_url: upload.imageUrl },
                });
            }
            setCategoryForm(emptyCategory);
            setSelectedCategoryImage(null);
            setSuccessMessage(isEnglish ? "Category saved." : "تم حفظ الفئة.");
            await loadData();
        } catch (error) {
            notifyError(error);
        } finally {
            setBusy("");
        }
    };

    const selectDocumentProject = (projectId) => {
        setDocumentProject(projectId);
        const latest = data.documents.find((document) => document.project_id === projectId);
        if (!latest) {
            setDocumentVersion("1.0");
            setChangelogAr("");
            setChangelogEn("");
            setPrivateFiles([]);
            return;
        }
        const versionParts = latest.version.split(".").map(Number);
        if (versionParts.length === 2) {
            setDocumentVersion(`${versionParts[0]}.${versionParts[1] + 1}`);
        } else {
            setDocumentVersion(`${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`);
        }
        setChangelogAr("");
        setChangelogEn("");
        setDocumentationJson(JSON.stringify(latest.documentation, null, 2));
        setPrivateFiles(latest.private_files || []);
        setSelectedPrivateFiles([]);
    };

    const publishDocument = async (event) => {
        event.preventDefault();
        setBusy("document");
        setErrorMessage("");
        setSuccessMessage("");
        try {
            if (!documentProject) throw new Error(isEnglish ? "Save a project first." : "احفظ مشروعًا أولًا.");
            const documentation = parseJson(
                documentationJson,
                isEnglish ? "Documentation" : "التوثيق",
            );
            const uploadedFiles = [...privateFiles];
            const fileNames = new Set(uploadedFiles.map((file) => file.file_name));
            for (const file of selectedPrivateFiles) {
                const contentType = file.type || "application/octet-stream";
                if (file.size > 100 * 1024 * 1024
                    || ![
                        "application/pdf",
                        "application/zip",
                        "application/x-zip-compressed",
                        "text/plain",
                        "text/markdown",
                        "application/json",
                        "application/octet-stream",
                    ].includes(contentType)) {
                    throw new Error(isEnglish
                        ? `${file.name} is not an allowed private file or exceeds 100 MB.`
                        : `الملف ${file.name} غير مدعوم أو يتجاوز 100 ميجابايت.`);
                }
                if (fileNames.has(file.name)) {
                    throw new Error(isEnglish
                        ? `A file named ${file.name} is already in this version.`
                        : `يوجد بالفعل ملف باسم ${file.name} في هذا الإصدار.`);
                }
                fileNames.add(file.name);
                const uploadedFile = await uploadProjectPrivateFile(documentProject, file);
                uploadedFiles.push(uploadedFile);
                setPrivateFiles([...uploadedFiles]);
            }
            const result = await callProjectService("document_publish", {
                projectId: documentProject,
                version: documentVersion,
                changelogAr,
                changelogEn,
                documentation,
                privateFiles: uploadedFiles,
            });
            setPrivateFiles(uploadedFiles);
            setSelectedPrivateFiles([]);
            setSuccessMessage(isEnglish
                ? `Documentation ${result.document.version} published.`
                : `تم نشر التوثيق إصدار ${result.document.version}.`);
        } catch (error) {
            notifyError(error);
        } finally {
            setBusy("");
        }
    };

    const decideOrder = async (order, decision) => {
        const action = decision === "confirm" ? "order_confirm" : "order_reject";
        const result = await runAction(`order-${order.id}`, () => callProjectService(action, { orderId: order.id }));
        if (result) {
            setSuccessMessage(isEnglish
                ? (decision === "confirm" ? "Payment confirmed and three-month access activated." : "Order rejected.")
                : (decision === "confirm" ? "تم تأكيد الدفع وتفعيل الصلاحية لثلاثة أشهر." : "تم رفض الطلب."));
        }
    };

    const presentIssuedCode = (result, { reference, reissued }) => {
        if (!result?.code) return;
        setActivationCode(result.code);
        setActivationCodeOrder(reference || "");
        setCopiedCode(false);
        if (reissued) {
            setSuccessMessage(isEnglish
                ? `A new code replaced the previous one for order ${reference}. The old code no longer works.`
                : `صدر رمز جديد بدل السابق للطلب ${reference}. الرمز القديم لم يعد يعمل.`);
            return;
        }
        setSuccessMessage(isEnglish
            ? `Paid order ${reference} confirmed. Copy this one-time code and send it to the customer; it will not be shown again.`
            : `تم تأكيد الطلب ${reference}. انسخ الرمز مرة واحدة وأرسله للعميل؛ لن يظهر مجددًا.`);
    };

    const issueCode = async (order) => {
        if (!confirmMissingDocumentation(order)) return;
        setActivationCode("");
        setActivationCodeOrder("");
        setCopiedCode(false);
        const result = await runAction(`code-${order.id}`, () => callProjectService("activation_code_issue", {
            orderId: order.id,
            expiresInDays: 30,
        }));
        presentIssuedCode(result, { reference: order.order_reference || order.id, reissued: false });
    };

    const reissueCode = async (order) => {
        const reference = order.order_reference || order.id;
        const accepted = window.confirm(isEnglish
            ? `Issue a new code for order ${reference}? The current code stops working immediately.`
            : `إصدار رمز جديد للطلب ${reference}؟ الرمز الحالي يتوقف عن العمل فورًا.`);
        if (!accepted) return;
        if (!confirmMissingDocumentation(order)) return;
        setActivationCode("");
        setActivationCodeOrder("");
        setCopiedCode(false);
        const result = await runAction(`reissue-${order.id}`, () => callProjectService("activation_code_reissue", {
            orderId: order.id,
            expiresInDays: 30,
        }));
        presentIssuedCode(result, { reference, reissued: true });
    };

    const copyActivationCode = async () => {
        try {
            await navigator.clipboard.writeText(activationCode);
            setCopiedCode(true);
            window.setTimeout(() => setCopiedCode(false), 2500);
        } catch {
            setErrorMessage(isEnglish
                ? "Could not copy automatically. Select the code and copy it manually."
                : "تعذر النسخ تلقائيًا. حدّد الرمز وانسخه يدويًا.");
        }
    };

    const startReassign = (order) => {
        setReassignOrderId(order.id);
        setReassignEmail(order.customer?.email || "");
        setErrorMessage("");
        setSuccessMessage("");
    };

    const cancelReassign = () => {
        setReassignOrderId("");
        setReassignEmail("");
    };

    const submitReassign = async (event, order) => {
        event.preventDefault();
        const email = reassignEmail.trim().toLowerCase();
        if (!email) {
            setErrorMessage(isEnglish
                ? "Enter the email of the account that should own this order."
                : "اكتب بريد الحساب الذي يجب أن يملك الطلب.");
            return;
        }
        const reference = order.order_reference || order.id;
        const accepted = window.confirm(isEnglish
            ? `Move order ${reference} to ${email}? The customer can then activate it only from that account.`
            : `نقل الطلب ${reference} إلى ${email}؟ لن يستطيع العميل تفعيله إلا من هذا الحساب.`);
        if (!accepted) return;

        const result = await runAction(`reassign-${order.id}`, () => callProjectService("order_reassign_user", {
            orderId: order.id,
            email,
        }));
        if (result) {
            setReassignOrderId("");
            setReassignEmail("");
            setSuccessMessage(isEnglish
                ? `Order ${reference} now belongs to ${result.customer?.email || email}. Re-issue a code if the previous one was already used.`
                : `الطلب ${reference} أصبح على الحساب ${result.customer?.email || email}. أعد إصدار رمز إن كان السابق مستخدمًا.`);
        }
    };

    const extendAccess = async (access) => {
        const result = await runAction(`extend-${access.id}`, () => callProjectService("access_extend", {
            accessId: access.id,
            months: 3,
        }));
        if (result) setSuccessMessage(isEnglish ? "Access extended by three months." : "تم تمديد الصلاحية ثلاثة أشهر.");
    };

    const revokeAccess = async (access) => {
        const accepted = window.confirm(isEnglish
            ? "Revoke this customer's access to the project?"
            : "هل تريد إيقاف صلاحية العميل لهذا المشروع؟");
        if (!accepted) return;
        const result = await runAction(`revoke-${access.id}`, () => callProjectService("access_revoke", {
            accessId: access.id,
        }));
        if (result) setSuccessMessage(isEnglish ? "Project access revoked." : "تم إيقاف صلاحية المشروع.");
    };

    const deleteOrder = async (orderId, source = "service_order") => {
        const accepted = window.confirm(isEnglish
            ? "Are you sure you want to delete this order?"
            : "هل أنت متأكد من حذف هذا الطلب؟");
        if (!accepted) return;
        const result = await runAction(`delete-order-${orderId}`, () => callProjectService("order_delete", {
            id: orderId,
            source
        }));
        if (result) {
            setData(prev => ({
                ...prev,
                orders: prev.orders.filter(o => o.id !== orderId)
            }));
            setSuccessMessage(isEnglish ? "Order deleted successfully." : "تم حذف الطلب بنجاح.");
        }
    };

    const approveProjectRequest = async (requestId) => {
        const accepted = window.confirm(isEnglish
            ? "Are you sure you want to approve this quotation request?"
            : "هل أنت متأكد من اعتماد طلب عرض السعر هذا؟");
        if (!accepted) return;
        const result = await runAction(`approve-request-${requestId}`, () => callProjectService("order_status_update", {
            id: requestId,
            status: "approved"
        }));
        if (result) {
            setData(prev => ({
                ...prev,
                orders: prev.orders.map(o => o.id === requestId ? { ...o, status: "approved" } : o)
            }));
            setSuccessMessage(isEnglish ? "Quotation request approved." : "تم اعتماد طلب عرض السعر.");
        }
    };

    const grantProjectRequestAccess = async (requestId) => {
        const accepted = window.confirm(isEnglish
            ? "Are you sure you want to grant access for this request?"
            : "هل أنت متأكد من منح صلاحية الوصول لهذا الطلب؟");
        if (!accepted) return;
        const result = await runAction(`grant-access-${requestId}`, () => callProjectService("project_access_grant", {
            id: requestId
        }));
        if (result) {
            setData(prev => ({
                ...prev,
                orders: prev.orders.map(o => o.id === requestId ? { ...o, access_granted: true } : o)
            }));
            setSuccessMessage(isEnglish ? "Access granted successfully." : "تم منح صلاحية الوصول بنجاح.");
        }
    };

    const codeForOrder = (order) => data.activationCodes.find((code) => code.order_id === order.id) || null;

    const describeCodeState = (code) => {
        if (!code) return "";
        if (code.redeemed_at) return isEnglish ? "used by the customer" : "مستخدم من العميل";
        if (code.revoked_at) return isEnglish ? "revoked" : "ملغي";
        if (code.expires_at && new Date(code.expires_at).getTime() <= now) {
            return isEnglish ? "expired" : "منتهي الصلاحية";
        }
        return isEnglish ? "issued, not used yet" : "صادر ولم يُستخدم بعد";
    };

    const orderHasActiveAccess = (order) => data.access.some((row) => (
        row.user_id === order.user_id
        && row.project_id === order.project_id
        && row.status === "active"
        && new Date(row.expires_at).getTime() > now
    ));

    const orderHasAccess = (order) => data.access.some((row) => row.order_id === order.id);

    const projectsWithDocumentation = useMemo(
        () => new Set(data.documents.map((document) => document.project_id)),
        [data.documents],
    );

    const projectHasDocumentation = (projectId) => projectsWithDocumentation.has(projectId);

    // A paid customer cannot open a project whose documentation was never published, so warn
    // before the code is issued instead of learning about it from the customer afterwards.
    const confirmMissingDocumentation = (order) => {
        if (projectHasDocumentation(order.project_id)) return true;
        const projectLabel = projectNames.get(order.project_id) || order.project_id;
        return window.confirm(isEnglish
            ? `"${projectLabel}" has no published documentation. The customer can activate the code but will see no content. Continue anyway?`
            : `المشروع «${projectLabel}» بدون توثيق منشور. العميل هيفعّل الرمز لكن مش هيشوف محتوى. تكمل؟`);
    };

    const projectNames = new Map(data.projects.map((project) => [
        project.id,
        isEnglish ? project.title_en : project.title_ar,
    ]));
    const categoryNames = new Map(data.categories.map((category) => [
        category.id,
        isEnglish ? category.title_en : category.title_ar,
    ]));
    const sectionLabels = {
        projects: isEnglish ? "Projects" : "المشاريع",
        categories: isEnglish ? "Categories" : "الفئات",
        documents: isEnglish ? "Documentation" : "التوثيق",
        orders: isEnglish ? "Orders" : "الطلبات",
        access: isEnglish ? "Access" : "الصلاحيات",
        analytics: isEnglish ? "Analytics" : "الإحصاءات",
    };

    return (
        <section className="admin-project-management">
            <header className="admin-project-heading">
                <div>
                    <span>TECHSPHERE · PROJECT MARKETPLACE</span>
                    <h2>{isEnglish ? "Services & project management" : "إدارة الخدمات والمشاريع"}</h2>
                </div>
                <button className="admin-project-action" type="button" onClick={loadData} disabled={isLoading}>
                    <RefreshCw size={16} aria-hidden="true" />
                    {isEnglish ? "Refresh" : "تحديث"}
                </button>
            </header>

            {errorMessage && <p className="admin-project-alert" role="alert">{errorMessage}</p>}
            {successMessage && <p className="admin-project-success" role="status">{successMessage}</p>}
            {activationCode && (
                <div className="admin-project-code" role="status">
                    <strong>
                        {isEnglish ? "One-time activation code (copy now):" : "رمز التفعيل لمرة واحدة (انسخه الآن):"}
                        {activationCodeOrder ? ` ${activationCodeOrder}` : ""}
                    </strong>
                    <code dir="ltr">{activationCode}</code>
                    <button
                        type="button"
                        className="admin-project-code-copy"
                        onClick={copyActivationCode}
                    >
                        {copiedCode ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                        {copiedCode
                            ? (isEnglish ? "Copied" : "تم النسخ")
                            : (isEnglish ? "Copy code" : "نسخ الرمز")}
                    </button>
                    <button
                        type="button"
                        className="admin-project-code-close"
                        onClick={() => { setActivationCode(""); setActivationCodeOrder(""); }}
                        aria-label={isEnglish ? "Hide code" : "إخفاء الرمز"}
                    >
                        <X size={16} />
                    </button>
                    <small>
                        {isEnglish
                            ? "Works once, and only for the customer account that placed this order."
                            : "يعمل مرة واحدة، ولحساب العميل صاحب هذا الطلب فقط."}
                    </small>
                </div>
            )}

            <nav className="admin-project-tabs" aria-label={isEnglish ? "Project management sections" : "أقسام إدارة المشاريع"}>
                {Object.entries(sectionLabels).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        className={activeSection === key ? "is-active" : ""}
                        onClick={() => setActiveSection(key)}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {isLoading ? (
                <div className="admin-project-loading" role="status"><LoaderCircle className="admin-project-spinner" />{isEnglish ? "Loading marketplace data..." : "جارٍ تحميل بيانات السوق..."}</div>
            ) : activeSection === "projects" ? (
                <>
                    <div className="admin-project-toolbar">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={isEnglish ? "Search projects" : "ابحث عن مشروع"}
                            aria-label={isEnglish ? "Search projects" : "ابحث عن مشروع"}
                        />
                        <select
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                            aria-label={isEnglish ? "Filter by category" : "تصفية حسب الفئة"}
                        >
                            <option value="all">{isEnglish ? "All categories" : "كل الفئات"}</option>
                            {data.categories.map((category) => (
                                <option key={category.id} value={category.id}>{categoryNames.get(category.id)}</option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            aria-label={isEnglish ? "Filter by sale status" : "تصفية حسب حالة البيع"}
                        >
                            <option value="all">{isEnglish ? "All statuses" : "كل الحالات"}</option>
                            <option value="draft">{isEnglish ? "Draft" : "مسودة"}</option>
                            <option value="published">{isEnglish ? "Published" : "منشور للبيع"}</option>
                            <option value="archived">{isEnglish ? "Archived" : "مؤرشف"}</option>
                        </select>
                        <button className="admin-project-action" type="button" onClick={() => openProjectForm()}>
                            <Plus size={17} />{isEnglish ? "Create project" : "إضافة مشروع"}
                        </button>
                    </div>
                    <p className="admin-project-result-count" aria-live="polite">
                        {isEnglish
                            ? `Showing ${filteredProjects.length ? (projectPage - 1) * projectsPerPage + 1 : 0}–${Math.min(projectPage * projectsPerPage, filteredProjects.length)} of ${filteredProjects.length} projects`
                            : `عرض ${filteredProjects.length ? (projectPage - 1) * projectsPerPage + 1 : 0}–${Math.min(projectPage * projectsPerPage, filteredProjects.length)} من ${filteredProjects.length} مشروع`}
                    </p>
                    {hasProtectedProjects && (
                        <p className="admin-project-protection-note">
                            {isEnglish
                                ? "Imported catalog projects cannot be deleted; archive them instead."
                                : "لا يمكن حذف مشاريع الكتالوج المستوردة؛ استخدم الأرشفة بدلًا من ذلك."}
                        </p>
                    )}
                    {!data.categories.length && (
                        <p className="admin-project-alert">{isEnglish
                            ? "Create a category before adding projects."
                            : "أنشئ فئة قبل إضافة المشاريع."}</p>
                    )}
                    <div className="admin-project-table-wrap">
                        <table className="admin-project-table">
                            <thead><tr>
                                <th>{isEnglish ? "Project" : "المشروع"}</th>
                                <th>{isEnglish ? "Category" : "الفئة"}</th>
                                <th>{isEnglish ? "Price" : "السعر"}</th>
                                <th>{isEnglish ? "Catalog" : "الكتالوج"}</th>
                                <th>{isEnglish ? "Sale status" : "حالة البيع"}</th>
                                <th>{isEnglish ? "Actions" : "الإجراءات"}</th>
                            </tr></thead>
                            <tbody>
                                {visibleProjects.map((project) => (
                                    <tr key={project.id}>
                                        <td>
                                            <strong>{isEnglish ? project.title_en : project.title_ar}</strong>
                                            <small>{project.project_code}</small>
                                            {!projectHasDocumentation(project.id) && (
                                                <small className="admin-project-doc-warning">
                                                    {isEnglish ? "no published docs" : "بدون توثيق منشور"}
                                                </small>
                                            )}
                                        </td>
                                        <td>{categoryNames.get(project.category_id)}</td>
                                        <td>{project.price == null
                                            ? (isEnglish ? "Not set" : "غير محدد")
                                            : `${project.price} ${project.currency_code}`}</td>
                                        <td>{project.catalog_visible
                                            ? (isEnglish ? "Visible" : "ظاهر")
                                            : (isEnglish ? "Hidden" : "مخفي")}</td>
                                        <td><span className={`admin-project-status status-${project.status}`}>{project.status}</span></td>
                                        <td className="admin-project-row-actions">
                                            <button type="button" onClick={() => openProjectForm(project)}>{isEnglish ? "Edit" : "تعديل"}</button>
                                            {project.status !== "archived" && (
                                                <button
                                                    type="button"
                                                    disabled={busy === `archive-${project.id}`}
                                                    onClick={() => runAction(
                                                        `archive-${project.id}`,
                                                        () => callProjectService("project_archive", { projectId: project.id }),
                                                        isEnglish ? "Project archived." : "تمت أرشفة المشروع.",
                                                    )}
                                                >
                                                    <Archive size={14} />{busy === `archive-${project.id}`
                                                        ? (isEnglish ? "Archiving..." : "جارٍ الأرشفة...")
                                                        : (isEnglish ? "Archive" : "أرشفة")}
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                disabled={(typeof project.source_document === "string"
                                                    && project.source_document.startsWith("Inventory ID: "))
                                                    || busy === `delete-${project.id}`}
                                                title={typeof project.source_document === "string"
                                                    && project.source_document.startsWith("Inventory ID: ")
                                                    ? (isEnglish ? "Imported catalog projects are protected; archive them instead." : "مشاريع الكتالوج المستوردة محمية؛ استخدم الأرشفة.")
                                                    : undefined}
                                                onClick={() => {
                                                    const confirmed = window.confirm(isEnglish
                                                        ? `Delete ${project.title_en}? This is allowed only if the project has no orders, access, or documentation.`
                                                        : `هل تريد حذف ${project.title_ar}؟ لا يُسمح بالحذف إذا كان للمشروع طلبات أو صلاحيات أو توثيق.`);
                                                    if (confirmed) {
                                                        runAction(
                                                            `delete-${project.id}`,
                                                            () => callProjectService("project_delete", { projectId: project.id }),
                                                            isEnglish ? "Project deleted." : "تم حذف المشروع.",
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash2 size={14} />{busy === `delete-${project.id}`
                                                    ? (isEnglish ? "Deleting..." : "جارٍ الحذف...")
                                                    : (isEnglish ? "Delete" : "حذف")}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProjects.length === 0 && <tr><td colSpan="6">{isEnglish ? "No projects found." : "لا توجد مشاريع."}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    {totalProjectPages > 1 && (
                        <nav className="admin-project-pagination" aria-label={isEnglish ? "Project pages" : "صفحات المشاريع"}>
                            <button
                                type="button"
                                disabled={projectPage === 1}
                                onClick={() => setProjectPage((page) => page - 1)}
                            >
                                {isEnglish ? "Previous" : "السابق"}
                            </button>
                            {Array.from({ length: totalProjectPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    className={page === projectPage ? "is-current" : ""}
                                    aria-current={page === projectPage ? "page" : undefined}
                                    onClick={() => setProjectPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                disabled={projectPage === totalProjectPages}
                                onClick={() => setProjectPage((page) => page + 1)}
                            >
                                {isEnglish ? "Next" : "التالي"}
                            </button>
                        </nav>
                    )}
                    {projectForm && (
                        <form className="admin-project-editor" onSubmit={saveProject} ref={projectEditorRef}>
                            <div className="admin-project-editor-heading">
                                <h3>{isEnglish ? (projectForm.id ? "Edit project" : "New project") : (projectForm.id ? "تعديل المشروع" : "مشروع جديد")}</h3>
                                <button type="button" onClick={() => setProjectForm(null)} aria-label={isEnglish ? "Close editor" : "إغلاق المحرر"}><X size={19} /></button>
                            </div>
                            <div className="admin-project-form-grid">
                                <ProjectFormField label={isEnglish ? "Permanent project ID" : "رقم المشروع الدائم"} value={projectForm.project_code}
                                    onChange={(value) => setProjectForm({ ...projectForm, project_code: value.toUpperCase() })}
                                    placeholder="TXH-EL-001" required readOnly={Boolean(projectForm.id)} />
                                <ProjectFormField label={isEnglish ? "URL slug" : "معرّف الرابط"} value={projectForm.slug}
                                    onChange={(value) => setProjectForm({ ...projectForm, slug: value })} required />
                                <label className="admin-project-field">
                                    <span>{isEnglish ? "Category" : "الفئة"}</span>
                                    <select value={projectForm.category_id} onChange={(event) => setProjectForm({ ...projectForm, category_id: event.target.value })} required>
                                        <option value="">{isEnglish ? "Select category" : "اختر الفئة"}</option>
                                        {data.categories.map((category) => <option key={category.id} value={category.id}>{categoryNames.get(category.id)}</option>)}
                                    </select>
                                </label>
                                <ProjectFormField label={isEnglish ? "Title (Arabic)" : "العنوان بالعربية"} value={projectForm.title_ar}
                                    onChange={(value) => setProjectForm({ ...projectForm, title_ar: value })} required />
                                <ProjectFormField label={isEnglish ? "Title (English)" : "العنوان بالإنجليزية"} value={projectForm.title_en}
                                    onChange={(value) => setProjectForm({ ...projectForm, title_en: value })} required />
                                <ProjectFormField label={isEnglish ? "Price" : "السعر"} type="number" min="0" step="0.01"
                                    value={projectForm.price} onChange={(value) => setProjectForm({ ...projectForm, price: value })} />
                                <p className="admin-project-help admin-project-field-wide">{isEnglish
                                    ? "Price is optional for catalog drafts. A project can go on sale only while visible in the catalog and priced above zero."
                                    : "السعر اختياري للمسودات الظاهرة في الكتالوج. لا يُتاح المشروع للبيع إلا إذا كان ظاهرًا وسعره أكبر من صفر."}</p>
                                <label className="admin-project-field">
                                    <span>{isEnglish ? "Difficulty (source-supported only)" : "المستوى (إذا ذكره المصدر فقط)"}</span>
                                    <select value={projectForm.difficulty || ""} onChange={(event) => setProjectForm({ ...projectForm, difficulty: event.target.value })}>
                                        <option value="">{isEnglish ? "Not specified" : "غير محدد"}</option>
                                        <option value="beginner">{isEnglish ? "Beginner" : "مبتدئ"}</option>
                                        <option value="intermediate">{isEnglish ? "Intermediate" : "متوسط"}</option>
                                        <option value="advanced">{isEnglish ? "Advanced" : "متقدم"}</option>
                                    </select>
                                </label>
                                <label className="admin-project-field">
                                    <span>{isEnglish ? "Sale status" : "حالة البيع"}</span>
                                    <select value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value })}>
                                        <option value="draft">{isEnglish ? "Draft" : "مسودة"}</option>
                                        <option value="published">{isEnglish ? "Published for sale" : "منشور للبيع"}</option>
                                        <option value="archived">{isEnglish ? "Archived" : "مؤرشف"}</option>
                                    </select>
                                </label>
                                <label className="admin-project-field">
                                    <span>{isEnglish ? "Public catalog visibility" : "الظهور في الكتالوج العام"}</span>
                                    <select value={projectForm.catalog_visible ? "true" : "false"}
                                        onChange={(event) => setProjectForm({ ...projectForm, catalog_visible: event.target.value === "true" })}>
                                        <option value="true">{isEnglish ? "Visible" : "ظاهر"}</option>
                                        <option value="false">{isEnglish ? "Hidden" : "مخفي"}</option>
                                    </select>
                                </label>
                                <label className="admin-project-field admin-project-field-wide">
                                    <span>{isEnglish ? "Public description (Arabic)" : "الوصف العام بالعربية"}</span>
                                    <textarea value={projectForm.public_description_ar} maxLength={4000}
                                        onChange={(event) => setProjectForm({ ...projectForm, public_description_ar: event.target.value })} />
                                </label>
                                <label className="admin-project-field admin-project-field-wide">
                                    <span>{isEnglish ? "Public description (English)" : "الوصف العام بالإنجليزية"}</span>
                                    <textarea value={projectForm.public_description_en} maxLength={4000}
                                        onChange={(event) => setProjectForm({ ...projectForm, public_description_en: event.target.value })} />
                                </label>
                                <ProjectFormField label={isEnglish ? "Source document" : "المستند المصدر"} value={projectForm.source_document}
                                    onChange={(value) => setProjectForm({ ...projectForm, source_document: value })} />
                                <div className="admin-project-image-field admin-project-field-wide">
                                    <span className="admin-project-image-label">
                                        {isEnglish ? "Project image (JPG/PNG/WebP ≤ 5 MB)" : "صورة المشروع (JPG أو PNG أو WebP، بحد أقصى 5 ميجابايت)"}
                                    </span>
                                    {(selectedImagePreview || projectForm.image_url) ? (
                                        <img
                                            className="admin-project-image-preview"
                                            src={selectedImagePreview || projectForm.image_url}
                                            alt={projectForm.image_alt_text || (isEnglish ? projectForm.title_en : projectForm.title_ar)}
                                        />
                                    ) : (
                                        <p className="admin-project-image-empty">
                                            {isEnglish ? "No project image has been added yet." : "لم تتم إضافة صورة لهذا المشروع بعد."}
                                        </p>
                                    )}
                                    <div className="admin-project-image-controls">
                                        <label className="admin-project-field">
                                            <span>{isEnglish ? "Choose an image" : "اختار صورة للمشروع"}</span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
                                            />
                                        </label>
                                        {selectedImage && (
                                            <button
                                                className="admin-project-action admin-project-cancel"
                                                type="button"
                                                onClick={() => setSelectedImage(null)}
                                            >
                                                <X size={15} />{isEnglish ? "Cancel replacement" : "إلغاء استبدال الصورة"}
                                            </button>
                                        )}
                                    </div>
                                    <p className="admin-project-help">
                                        {selectedImage
                                            ? (isEnglish
                                                ? `${selectedImage.name} will replace the current image when you save.`
                                                : `سيتم رفع ${selectedImage.name} وربطها بهذا المشروع بدل الصورة الحالية عند الحفظ.`)
                                            : (isEnglish
                                                ? "Choose a file to add or replace this project's image. The current image stays unchanged until you save."
                                                : "اختار ملفًا لإضافة صورة المشروع أو استبدالها. الصورة الحالية لن تتغير إلا بعد الضغط على حفظ المشروع.")}
                                    </p>
                                </div>
                                <ProjectFormField label={isEnglish ? "Image source URL" : "رابط مصدر الصورة"}
                                    value={projectForm.image_source_url || ""}
                                    onChange={(value) => setProjectForm({ ...projectForm, image_source_url: value })} />
                                <ProjectFormField label={isEnglish ? "Image license / attribution" : "ترخيص الصورة / الإسناد"}
                                    value={projectForm.image_license || ""}
                                    onChange={(value) => setProjectForm({ ...projectForm, image_license: value })} />
                                <ProjectFormField label={isEnglish ? "Image alt text" : "النص البديل للصورة"}
                                    value={projectForm.image_alt_text || ""}
                                    onChange={(value) => setProjectForm({ ...projectForm, image_alt_text: value })}
                                    maxLength={300} />
                            </div>
                            <button className="admin-project-action" type="submit" disabled={busy === "project"}>
                                <Save size={16} />{busy === "project" ? (isEnglish ? "Saving..." : "جارٍ الحفظ...") : (isEnglish ? "Save project" : "حفظ المشروع")}
                            </button>
                        </form>
                    )}
                </>
            ) : activeSection === "categories" ? (
                <div className="admin-project-two-column">
                    <form className="admin-project-editor" onSubmit={saveCategory}>
                        <h3>{categoryForm.id
                            ? (isEnglish ? "Edit project category" : "تعديل فئة المشاريع")
                            : (isEnglish ? "Add a project category" : "إضافة فئة مشاريع")}</h3>
                        <div className="admin-project-form-grid">
                            <ProjectFormField label={isEnglish ? "Slug" : "معرّف الرابط"} value={categoryForm.slug}
                                onChange={(value) => setCategoryForm({ ...categoryForm, slug: value })} required />
                            <ProjectFormField label={isEnglish ? "Arabic name" : "الاسم بالعربية"} value={categoryForm.title_ar}
                                onChange={(value) => setCategoryForm({ ...categoryForm, title_ar: value })} required />
                            <ProjectFormField label={isEnglish ? "English name" : "الاسم بالإنجليزية"} value={categoryForm.title_en}
                                onChange={(value) => setCategoryForm({ ...categoryForm, title_en: value })} required />
                            <ProjectFormField label={isEnglish ? "Category image URL" : "رابط صورة القسم"}
                                value={categoryForm.image_url || ""}
                                onChange={(value) => setCategoryForm({ ...categoryForm, image_url: value })} />
                            <ProjectFormField label={isEnglish ? "Category image alt text" : "النص البديل لصورة القسم"}
                                value={categoryForm.image_alt_text || ""}
                                onChange={(value) => setCategoryForm({ ...categoryForm, image_alt_text: value })}
                                maxLength={300} />
                            <label className="admin-project-field">
                                <span>{isEnglish ? "Upload category image (JPG/PNG/WebP ≤ 5 MB)" : "رفع صورة القسم (≤ 5 ميجابايت)"}</span>
                                <input type="file" accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => setSelectedCategoryImage(event.target.files?.[0] || null)} />
                            </label>
                            <ProjectFormField label={isEnglish ? "Sort order" : "الترتيب"} type="number" min="0" step="1"
                                value={categoryForm.sort_order} onChange={(value) => setCategoryForm({ ...categoryForm, sort_order: Number(value) })} required />
                            <label className="admin-project-field">
                                <span>{isEnglish ? "Visibility" : "حالة الظهور"}</span>
                                <select value={categoryForm.is_active ? "true" : "false"}
                                    onChange={(event) => setCategoryForm({ ...categoryForm, is_active: event.target.value === "true" })}>
                                    <option value="true">{isEnglish ? "Active" : "نشطة"}</option>
                                    <option value="false">{isEnglish ? "Inactive" : "غير نشطة"}</option>
                                </select>
                            </label>
                            <label className="admin-project-field admin-project-field-wide">
                                <span>{isEnglish ? "Description (Arabic)" : "الوصف بالعربية"}</span>
                                <textarea value={categoryForm.description_ar} maxLength={2000}
                                    onChange={(event) => setCategoryForm({ ...categoryForm, description_ar: event.target.value })} />
                            </label>
                            <label className="admin-project-field admin-project-field-wide">
                                <span>{isEnglish ? "Description (English)" : "الوصف بالإنجليزية"}</span>
                                <textarea value={categoryForm.description_en} maxLength={2000}
                                    onChange={(event) => setCategoryForm({ ...categoryForm, description_en: event.target.value })} />
                            </label>
                        </div>
                        <button className="admin-project-action" type="submit" disabled={busy === "category"}>
                            {categoryForm.id ? <Save size={16} /> : <Plus size={16} />}
                            {isEnglish ? "Save category" : "حفظ الفئة"}
                        </button>
                        {categoryForm.id && (
                            <button className="admin-project-action admin-project-cancel" type="button" onClick={() => {
                                setSelectedCategoryImage(null);
                                setCategoryForm(emptyCategory);
                            }}>
                                {isEnglish ? "Cancel editing" : "إلغاء التعديل"}
                            </button>
                        )}
                    </form>
                    <div className="admin-project-category-list">
                        {data.categories.map((category) => (
                            <article key={category.id}>
                                <div>
                                    <strong>{categoryNames.get(category.id)}</strong>
                                    <code>{category.slug}</code>
                                    <span>{data.projects.filter((project) => project.category_id === category.id).length} {isEnglish ? "projects" : "مشاريع"}</span>
                                    {!category.is_active && <small>{isEnglish ? "Inactive" : "غير نشطة"}</small>}
                                </div>
                                <button type="button" className="admin-project-action" onClick={() => {
                                    setSelectedCategoryImage(null);
                                    setCategoryForm({ ...category });
                                }}>
                                    <Pencil size={15} aria-hidden="true" />{isEnglish ? "Edit" : "تعديل"}
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            ) : activeSection === "documents" ? (
                <form className="admin-project-editor" onSubmit={publishDocument}>
                    <h3><FilePlus2 size={18} />{isEnglish ? "Publish a documentation version" : "نشر نسخة توثيق"}</h3>
                    <p className="admin-project-help">
                        {isEnglish
                            ? 'The customer sees five blocks: project name and code (taken from the project record), the idea, the manufacturing steps, the tools and materials, and the goal. Write every field as { "ar": "…", "en": "…" }; steps and tools are lists of strings. Empty English falls back to Arabic, and any extra key appears under "Additional details".'
                            : 'العميل بيشوف خمسة أقسام: اسم المشروع والكود (بياخدهم من بيانات المشروع)، الفكرة، خطوات التصنيع، الأدوات والخامات، والهدف والفايدة. اكتب كل حقل بالشكل { "ar": "…", "en": "…" }؛ الخطوات والأدوات قوائم نصوص. لو الإنجليزي فاضي بيظهر العربي، وأي مفتاح إضافي هيظهر تحت «تفاصيل إضافية».'}
                    </p>
                    <div className="admin-project-form-grid">
                        <label className="admin-project-field admin-project-field-wide">
                            <span>{isEnglish ? "Project" : "المشروع"}</span>
                            <select value={documentProject} onChange={(event) => selectDocumentProject(event.target.value)} required>
                                <option value="">{isEnglish ? "Select project" : "اختر المشروع"}</option>
                                {data.projects.map((project) => <option key={project.id} value={project.id}>{project.project_code} · {projectNames.get(project.id)}</option>)}
                            </select>
                        </label>
                        <ProjectFormField label={isEnglish ? "Version" : "الإصدار"} value={documentVersion} onChange={setDocumentVersion} required />
                        <label className="admin-project-field">
                            <span>{isEnglish ? "Private files (PDF/ZIP/etc.)" : "ملفات خاصة (PDF/ZIP وغيرها)"}</span>
                            <input type="file" multiple accept=".pdf,.zip,.txt,.md,.json" onChange={(event) => setSelectedPrivateFiles(Array.from(event.target.files || []))} />
                        </label>
                        <label className="admin-project-field admin-project-field-wide">
                            <span>{isEnglish ? "Changelog (Arabic)" : "سجل التغييرات بالعربية"}</span>
                            <textarea value={changelogAr} onChange={(event) => setChangelogAr(event.target.value)} maxLength={3000} />
                        </label>
                        <label className="admin-project-field admin-project-field-wide">
                            <span>{isEnglish ? "Changelog (English)" : "سجل التغييرات بالإنجليزية"}</span>
                            <textarea value={changelogEn} onChange={(event) => setChangelogEn(event.target.value)} maxLength={3000} />
                        </label>
                        <label className="admin-project-field admin-project-field-wide">
                            <span>{isEnglish ? "Private documentation JSON" : "محتوى التوثيق الخاص بصيغة JSON"}</span>
                            <textarea className="admin-project-json" value={documentationJson}
                                onChange={(event) => setDocumentationJson(event.target.value)} spellCheck="false" required />
                        </label>
                    </div>
                    {privateFiles.length > 0 && (
                        <div className="admin-project-file-list">
                            <strong>{isEnglish ? "Already uploaded in this draft:" : "ملفات مرفوعة في المسودة:"}</strong>
                            {privateFiles.map((file) => <span key={file.path}>{file.file_name}</span>)}
                        </div>
                    )}
                    {selectedPrivateFiles.length > 0 && (
                        <p>{selectedPrivateFiles.length} {isEnglish ? "file(s) will be uploaded." : "ملف سيتم رفعها."}</p>
                    )}
                    <button className="admin-project-action" type="submit" disabled={busy === "document"}>
                        {busy === "document" ? <LoaderCircle className="admin-project-spinner" /> : <Upload size={16} />}
                        {isEnglish ? "Publish version" : "نشر الإصدار"}
                    </button>
                </form>
            ) : activeSection === "orders" ? (
                <div className="admin-project-record-list">
                    {data.orders.map((order) => {
                        const isRequest = order.source === "project_request";
                        const request = isRequest ? {
                            customer_name: order.customerName,
                            phone: order.buyer_phone,
                            budget_range: order.budgetRange || (order.amount ? String(order.amount) : undefined),
                            delivery_window: order.deliveryWindow,
                            address: order.deliveryAddress,
                            notes: order.notes || order.additional_message
                        } : getOrderRequestDetails(order.customer_message);
                        const orderCode = isRequest ? null : codeForOrder(order);
                        const budgetLabels = {
                            under_3000: isEnglish ? `Under 3,000 ${order.currency}` : `أقل من ٣٬٠٠٠ ${order.currency}`,
                            "3000_7000": isEnglish ? `3,000–7,000 ${order.currency}` : `من ٣٬٠٠٠ إلى ٧٬٠٠٠ ${order.currency}`,
                            "7000_15000": isEnglish ? `7,000–15,000 ${order.currency}` : `من ٧٬٠٠٠ إلى ١٥٬٠٠٠ ${order.currency}`,
                            over_15000: isEnglish ? `Over 15,000 ${order.currency}` : `أكثر من ١٥٬٠٠٠ ${order.currency}`,
                            flexible: isEnglish ? "Flexible / discuss" : "مرنة / مناقشة",
                        };
                        const deliveryLabels = {
                            within_1_week: isEnglish ? "Within one week" : "خلال أسبوع",
                            within_2_weeks: isEnglish ? "Within two weeks" : "خلال أسبوعين",
                            within_1_month: isEnglish ? "Within one month" : "خلال شهر",
                            flexible: isEnglish ? "Flexible / to be agreed" : "مرن / يتم الاتفاق",
                        };
                        return (
                            <article key={order.id} className="admin-project-record">
                                <div className="admin-project-order-details">
                                    {(() => {
                                        const projectNamesMap = new Map((data.projects || []).map(p => [p.id, p]));
                                        const projectName = order.project_id ? projectNamesMap.get(order.project_id)?.title_ar || projectNamesMap.get(order.project_id)?.title_en : null;
                                        return (
                                            <>
                                                <strong>{order.customerName || order.customer?.full_name || order.customer?.email || order.user_id}</strong>
                                                <span>
                                                    {projectName}
                                                    {!isRequest && !projectHasDocumentation(order.project_id) && (
                                                        <span className="admin-project-doc-warning">
                                                            {isEnglish ? "no published docs" : "بدون توثيق منشور"}
                                                        </span>
                                                    )}
                                                </span>
                                                <code>{order.reference}</code>
                                                <small>{order.amount ? `${order.amount} ${order.currency}` : ""} · {order.type} · {order.status}</small>
                                                {order.customer?.email && <small>{isEnglish ? "Account email" : "بريد الحساب"}: {order.customer.email}</small>}
                                                {request && (
                                                    <div className="admin-project-order-request">
                                                        <strong>{isEnglish ? "Customer request details" : "تفاصيل طلب العميل"}</strong>
                                                        {request.phone && <span>{isEnglish ? "Phone" : "الهاتف"}: <bdi dir="ltr">{request.phone}</bdi></span>}
                                                        {request.budget_range && <span>{isEnglish ? "Expected budget" : "الميزانية المتوقعة"}: {budgetLabels[request.budget_range] || request.budget_range}</span>}
                                                        {request.delivery_window && <span>{isEnglish ? "Preferred delivery" : "موعد التسليم"}: {deliveryLabels[request.delivery_window] || request.delivery_window}</span>}
                                                        {request.address && <span>{isEnglish ? "Detailed address" : "العنوان بالتفصيل"}: {request.address}</span>}
                                                        {request.notes && <span>{isEnglish ? "Project notes" : "ملاحظات المشروع"}: {request.notes}</span>}
                                                    </div>
                                                )}
                                                {!request && order.message && !isRequest && (
                                                    <small>{isEnglish ? "Customer message" : "رسالة العميل"}: {order.message}</small>
                                                )}
                                                {!isRequest && orderCode && (
                                                    <small>
                                                        {isEnglish ? "Activation code" : "رمز التفعيل"}: {describeCodeState(orderCode)}
                                                        {orderCode.expires_at
                                                            ? ` · ${new Date(orderCode.expires_at).toLocaleDateString(isEnglish ? "en-US" : "ar-EG")}`
                                                            : ""}
                                                    </small>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                                {!isRequest && order.status === "confirmed"
                                    && order.type === "activation_code"
                                    && !orderHasActiveAccess(order) && (
                                    <div className="admin-project-record-actions">
                                        <button
                                            type="button"
                                            className="admin-project-action-reissue"
                                            onClick={() => reissueCode(order)}
                                            disabled={busy === `reissue-${order.id}`}
                                            title={isEnglish
                                                ? "Cancels the current code and issues a fresh one for this order."
                                                : "يلغي الرمز الحالي ويصدر رمزًا جديدًا لنفس الطلب."}
                                        >
                                            <RefreshCw size={15} />{isEnglish ? "Re-issue code" : "إعادة إصدار رمز"}
                                        </button>
                                    </div>
                                )}
                                {!isRequest && order.status === "pending" && (
                                    <div className="admin-project-record-actions">
                                        <button
                                            type="button"
                                            onClick={() => decideOrder(order, "confirm")}
                                            disabled={busy === `order-${order.id}`}
                                            title={isEnglish
                                                ? "Confirms payment and starts three months of access immediately, without a code."
                                                : "يؤكد الدفع ويفتح صلاحية ثلاثة أشهر فورًا دون رمز."}
                                        >
                                            <Check size={15} />{isEnglish ? "Confirm & activate" : "تأكيد وتفعيل"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => issueCode(order)}
                                            disabled={busy === `code-${order.id}`}
                                            title={isEnglish
                                                ? "Confirms payment and issues a one-time code the customer activates from their own account."
                                                : "يؤكد الدفع ويصدر رمزًا لمرة واحدة يفعّله العميل من حسابه."}
                                        >
                                            <KeyRound size={15} />{isEnglish ? "Confirm & issue code" : "تأكيد وإصدار رمز"}
                                        </button>
                                        <button type="button" onClick={() => decideOrder(order, "reject")} disabled={busy === `order-${order.id}`}>
                                            <X size={15} />{isEnglish ? "Reject" : "رفض"}
                                        </button>
                                    </div>
                                )}
                                {!isRequest && !orderHasAccess(order) && (
                                    <div className="admin-project-record-actions admin-project-reassign-trigger">
                                        <button
                                            type="button"
                                            className="admin-project-action-reassign"
                                            onClick={() => (reassignOrderId === order.id ? cancelReassign() : startReassign(order))}
                                            disabled={busy === `reassign-${order.id}`}
                                            title={isEnglish
                                                ? "Move this order to the customer's correct account so the code activates from their own login."
                                                : "نقل الطلب لحساب العميل الصحيح حتى يعمل الرمز من حسابه هو."}
                                        >
                                            <UserRoundPen size={15} />
                                            {isEnglish ? "Reassign account" : "إعادة إسناد الحساب"}
                                        </button>
                                    </div>
                                )}
                                {!isRequest && reassignOrderId === order.id && (
                                    <form className="admin-project-reassign" onSubmit={(event) => submitReassign(event, order)}>
                                        <label className="admin-project-reassign-field">
                                            <span>{isEnglish ? "Email of the account that should own this order" : "بريد الحساب الذي يجب أن يملك الطلب"}</span>
                                            <input
                                                type="email"
                                                value={reassignEmail}
                                                onChange={(event) => setReassignEmail(event.target.value)}
                                                placeholder="customer@example.com"
                                                dir="ltr"
                                                required
                                            />
                                        </label>
                                        <div className="admin-project-reassign-actions">
                                            <button type="submit" disabled={busy === `reassign-${order.id}`}>
                                                <UserRoundPen size={15} />
                                                {busy === `reassign-${order.id}`
                                                    ? (isEnglish ? "Moving..." : "جارٍ النقل...")
                                                    : (isEnglish ? "Move order" : "نقل الطلب")}
                                            </button>
                                            <button type="button" onClick={cancelReassign}>
                                                {isEnglish ? "Cancel" : "إلغاء"}
                                            </button>
                                        </div>
                                        <small>
                                            {isEnglish ? "Currently registered to:" : "مسجّل حاليًا على:"} {order.customer?.email || order.user_id}
                                        </small>
                                    </form>
                                )}
                                <div className="admin-project-record-actions">
                                    {isRequest && order.status === "pending_review" && (
                                        <button
                                            type="button"
                                            className="admin-project-action-approve"
                                            onClick={() => approveProjectRequest(order.id)}
                                            disabled={busy === `approve-request-${order.id}`}
                                            title={isEnglish
                                                ? "Approve this quotation request"
                                                : "اعتماد طلب عرض السعر"}
                                        >
                                            <Check size={15} />
                                            {busy === `approve-request-${order.id}`
                                                ? (isEnglish ? "Approving..." : "جارٍ الاعتماد...")
                                                : (isEnglish ? "Approve" : "اعتماد")}
                                        </button>
                                    )}
                                    {isRequest && (order.status === "approved" || order.status === "in_progress") && !order.access_granted && (
                                        <button
                                            type="button"
                                            className="admin-project-action-grant"
                                            onClick={() => grantProjectRequestAccess(order.id)}
                                            disabled={busy === `grant-access-${order.id}`}
                                            title={isEnglish
                                                ? "Grant project access to this request"
                                                : "منح صلاحية الوصول لهذا الطلب"}
                                        >
                                            <KeyRound size={15} />
                                            {busy === `grant-access-${order.id}`
                                                ? (isEnglish ? "Granting..." : "جارٍ منح الصلاحية...")
                                                : (isEnglish ? "Grant Access" : "منح الوصول")}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="admin-project-action-delete"
                                        onClick={() => deleteOrder(order.id, order.source)}
                                        disabled={busy === `delete-order-${order.id}`}
                                        title={isEnglish
                                            ? "Delete this order permanently."
                                            : "حذف هذا الطلب نهائيًا."}
                                    >
                                        <Trash2 size={15} />
                                        {busy === `delete-order-${order.id}`
                                            ? (isEnglish ? "Deleting..." : "جارٍ الحذف...")
                                            : (isEnglish ? "Delete" : "حذف")}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                    {!data.orders.length && <div className="admin-project-empty">{isEnglish ? "No project orders." : "لا توجد طلبات مشاريع."}</div>}
                </div>
            ) : activeSection === "access" ? (
                <div className="admin-project-record-list">
                    {data.access.map((access) => (
                        <article key={access.id} className="admin-project-record">
                            <div>
                                <strong>{access.customer?.full_name || access.customer?.email || access.user_id}</strong>
                                <span>{projectNames.get(access.project_id)} · {data.projects.find((project) => project.id === access.project_id)?.project_code}</span>
                                <small>
                                    {new Date(access.activated_at).toLocaleDateString()} – {new Date(access.expires_at).toLocaleDateString()}
                                    {" · "}{access.status}
                                </small>
                            </div>
                            {access.status !== "revoked" && (
                                <div className="admin-project-record-actions">
                                    <button type="button" onClick={() => extendAccess(access)}><RefreshCw size={15} />{isEnglish ? "+3 months" : "+٣ أشهر"}</button>
                                    <button type="button" onClick={() => revokeAccess(access)}><X size={15} />{isEnglish ? "Revoke" : "إيقاف"}</button>
                                </div>
                            )}
                        </article>
                    ))}
                    {!data.access.length && <div className="admin-project-empty">{isEnglish ? "No access grants." : "لا توجد صلاحيات مشاريع."}</div>}
                </div>
            ) : (
                <section className="admin-project-analytics">
                    <div className="admin-project-metrics">
                        <article><span>{isEnglish ? "Confirmed orders" : "الطلبات المؤكدة"}</span><strong>{analytics?.totalOrders ?? 0}</strong></article>
                        <article><span>{isEnglish ? "Active access" : "صلاحيات فعّالة"}</span><strong>{analytics?.activeAccessCount ?? 0}</strong></article>
                        <article><span>{isEnglish ? "Expired access" : "صلاحيات منتهية"}</span><strong>{analytics?.expiredAccessCount ?? 0}</strong></article>
                        <article><span>{isEnglish ? "Renewal orders" : "طلبات التجديد"}</span><strong>{analytics?.renewalOrders ?? 0}</strong></article>
                        {Object.entries(analytics?.totalRevenue || {}).map(([currency, amount]) => (
                            <article key={currency}><span>{isEnglish ? "Confirmed revenue" : "الإيراد المؤكد"} · {currency}</span><strong>{Number(amount).toLocaleString(isEnglish ? "en-US" : "ar-EG")}</strong></article>
                        ))}
                    </div>
                    <h3><BarChart3 size={18} />{isEnglish ? "Best-selling projects" : "المشاريع الأعلى مبيعًا"}</h3>
                    {(analytics?.salesByProject || []).map((row) => (
                        <div className="admin-project-analytics-row" key={row.project?.id}>
                            <span>{row.project ? (isEnglish ? row.project.title_en : row.project.title_ar) : "—"}</span>
                            <strong>{row.count}</strong>
                        </div>
                    ))}
                    <h3>{isEnglish ? "Monthly confirmed revenue" : "الإيرادات المؤكدة شهريًا"}</h3>
                    {(analytics?.monthlyRevenue || []).map(([month, amount]) => (
                        <div className="admin-project-analytics-row" key={month}>
                            <span>{month}</span><strong>{Number(amount).toLocaleString(isEnglish ? "en-US" : "ar-EG")}</strong>
                        </div>
                    ))}
                    <h3><KeyRound size={18} />{isEnglish ? "Activation code history" : "سجل رموز التفعيل"}</h3>
                    {data.activationCodes.map((code) => (
                        <div className="admin-project-analytics-row" key={code.id}>
                            <span>
                                {projectNames.get(code.project_id)}
                                {" · "}{code.redeemed_at
                                    ? (isEnglish ? "Redeemed" : "تم استخدامه")
                                    : code.revoked_at
                                        ? (isEnglish ? "Revoked" : "ملغي")
                                        : (isEnglish ? "Unused" : "غير مستخدم")}
                            </span>
                            <small>{code.expires_at ? new Date(code.expires_at).toLocaleDateString() : (isEnglish ? "No expiry" : "بلا انتهاء")}</small>
                        </div>
                    ))}
                </section>
            )}
        </section>
    );
}
