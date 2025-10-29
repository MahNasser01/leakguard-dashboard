import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Shield, FileText, Users, Link, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { useApi } from "@/services/api";

interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  level: string;
  guardrails: string[];
  icons: string[];
}

const templates: PolicyTemplate[] = [
  {
    id: "default",
    name: "Lakera Default Policy",
    description: "Applies the strictest security measures, ensuring full protection at the highest sensitivity.",
    level: "L4",
    guardrails: ["Prompt Defense", "Content Moderation", "Data Leakage Prevention", "Unknown Links"],
    icons: ["prompt", "content", "data", "link"],
  },
  {
    id: "public",
    name: "Public-facing Application",
    description: "Optimized for public-facing AI tools, balancing security and user experience.",
    level: "L2",
    guardrails: ["Prompt Defense", "Content Moderation", "Data Leakage Prevention", "Unknown Links"],
    icons: ["prompt", "content", "data", "link"],
  },
  {
    id: "internal",
    name: "Internal-facing Application",
    description: "A lighter policy for internal AI tools, reducing unnecessary flagging while maintaining security.",
    level: "L1",
    guardrails: ["Prompt Defense", "Data Leakage Prevention", "Unknown Links"],
    icons: ["prompt", "data", "link"],
  },
  {
    id: "prompt-only",
    name: "Prompt Defense Only",
    description: "A policy focused exclusively on preventing prompt-based attacks and ensuring the integrity of AI-generated responses.",
    level: "L2",
    guardrails: ["Prompt Defense"],
    icons: ["prompt"],
  },
];

const guardrailDetails = {
  "Prompt Defense": {
    description: "Prevent manipulation of GenAI models by stopping prompt injection attacks, jailbreaks and untrusted instructions overriding intended model behavior",
    count: 1,
  },
  "Content Moderation": {
    description: "Protect your users by ensuring harmful or inappropriate content is not passed into or comes out of your GenAI application",
    subcategories: ["Hate", "Sexual", "Profanity", "Violence", "Weapons", "Crime"],
    count: 6,
  },
  "Data Leakage Prevention": {
    description: "Prevent sensitive data leakage including PII, financial information, and confidential business data",
    subcategories: ["PII", "Credit Cards", "API Keys", "Passwords", "Email Addresses", "Phone Numbers", "SSN", "Addresses"],
    count: 8,
  },
  "Unknown Links": {
    description: "Detect and flag potentially malicious URLs that are not among trusted domains",
    count: 1,
  },
};

const sensitivityLevels = [
  { value: 1, label: "L1", description: "Lenient - Minimal flagging, lower security" },
  { value: 2, label: "L2", description: "Balanced - Moderate security and usability" },
  { value: 3, label: "L3", description: "Strict - Higher security, more false positives" },
  { value: 4, label: "L4", description: "Maximum Protection - Highest security stance. Flags anything suspicious, including edge cases with lower confidence." },
];

export default function PolicyCreate() {
  const navigate = useNavigate();
  const { policyId } = useParams<{ policyId: string }>();
  const api = useApi();
  const [step, setStep] = useState<"template" | "configure">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState<string | null>(null);
  const [policyName, setPolicyName] = useState("");
  const [sensitivity, setSensitivity] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!policyId;

  // Load policy data when editing
  useEffect(() => {
    if (isEditMode && policyId) {
      setIsLoading(true);
      api.policies.get(policyId)
        .then((policy: any) => {
          setPolicyName(policy.name);
          const sensitivityLevel = parseInt(policy.sensitivity.replace("L", ""));
          setSensitivity(sensitivityLevel);
          
          // Find matching template
          const template = templates.find(t => 
            t.guardrails.length === policy.guardrails.length &&
            t.guardrails.every(g => policy.guardrails.includes(g))
          );
          
          if (template) {
            setSelectedTemplate(template);
            setStep("configure");
          }
        })
        .catch((error) => {
          console.error("Failed to load policy:", error);
          toast.error("Failed to load policy");
          navigate("/policies");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isEditMode, policyId]);

  const handleSelectTemplate = (template: PolicyTemplate) => {
    setSelectedTemplate(template);
    setPolicyName(template.name);
    setSensitivity(parseInt(template.level.replace("L", "")));
    setStep("configure");
  };

  const handleSavePolicy = async () => {
    if (!policyName.trim()) {
      toast.error("Please enter a policy name");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    setIsSubmitting(true);
    try {
      const policyData = {
        name: policyName,
        policy_id: isEditMode && policyId ? policyId : `policy-${policyName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        guardrails: selectedTemplate.guardrails,
        sensitivity: `L${sensitivity}`,
        projects: "",
      };

      if (isEditMode && policyId) {
        await api.policies.update(policyId, policyData);
        toast.success("Policy updated successfully");
      } else {
        await api.policies.create(policyData);
        toast.success("Policy created successfully");
      }
      
      navigate("/policies");
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} policy:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} policy`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading policy...</p>
      </div>
    );
  }

  if (step === "template") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/policies")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{isEditMode ? "Edit policy" : "New policy"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              A policy defines the guardrails applied to all API requests in assigned projects. These guardrails will flag any detected threats based on the configured threshold.
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-8">
          <h2 className="text-2xl font-semibold mb-2">Choose Your Security Approach</h2>
          <p className="text-muted-foreground mb-8">
            Get started by selecting a <span className="font-semibold">pre-configured policy template</span> tailored to your use case or build your own custom policy <span className="font-semibold">from scratch</span>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="rounded-lg border bg-card p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    {template.icons.includes("prompt") && (
                      <div className="h-8 w-8 rounded bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    )}
                    {template.icons.includes("content") && (
                      <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    {template.icons.includes("data") && (
                      <div className="h-8 w-8 rounded bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                        <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    {template.icons.includes("link") && (
                      <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Link className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <div className="flex h-4 gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-1 ${
                            i <= parseInt(template.level.replace("L", ""))
                              ? i <= 2
                                ? "bg-orange-500"
                                : i === 3
                                ? "bg-orange-600"
                                : "bg-red-500"
                              : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{template.level}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateDetails(template.id)}
                  >
                    Details
                  </Button>
                  <Button onClick={() => handleSelectTemplate(template)}>
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showTemplateDetails && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {templates.find((t) => t.id === showTemplateDetails)?.name}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      {templates.find((t) => t.id === showTemplateDetails)?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <div className="flex h-4 gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-1 ${
                            i <= parseInt(templates.find((t) => t.id === showTemplateDetails)?.level.replace("L", "") || "1")
                              ? i <= 2
                                ? "bg-orange-500"
                                : i === 3
                                ? "bg-orange-600"
                                : "bg-red-500"
                              : "bg-gray-300 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{templates.find((t) => t.id === showTemplateDetails)?.level}</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">SELECTED GUARDRAILS</h3>
                  <div className="space-y-4">
                    {templates
                      .find((t) => t.id === showTemplateDetails)
                      ?.guardrails.map((guardrail) => (
                        <div key={guardrail} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                                <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <h4 className="font-semibold">{guardrail}</h4>
                            </div>
                            <span className="text-sm text-muted-foreground">Input & Output</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {guardrailDetails[guardrail as keyof typeof guardrailDetails]?.description}
                          </p>
                          {(() => {
                            const detail = guardrailDetails[guardrail as keyof typeof guardrailDetails];
                            if (detail && 'subcategories' in detail) {
                              return (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {detail.subcategories.map((sub) => (
                                    <span key={sub} className="text-xs border rounded-full px-3 py-1">
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t pt-6">
                  <Button variant="outline" onClick={() => setShowTemplateDetails(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    const template = templates.find((t) => t.id === showTemplateDetails);
                    if (template) handleSelectTemplate(template);
                    setShowTemplateDetails(null);
                  }}>
                    Select
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setStep("template")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-foreground">{isEditMode ? "Edit Policy" : "Create Policy"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fine-tune the policy by <span className="font-semibold">adjusting the flagging sensitivity</span> to match your security and user experience needs. Adjust and validate before assigning to projects to be applied at runtime.
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-8 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-1">General info</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose a name for your policy to make it easily identifiable. The Policy ID is used for reference in logs.
          </p>
          <div className="space-y-2">
            <Label htmlFor="policyName">Policy name</Label>
            <Input
              id="policyName"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Enter policy name"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Guardrails selected</h2>
            <Button variant="outline" size="sm">
              Advanced settings
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            These are the active guardrails enforced by your policy
          </p>
          <div className="space-y-2">
            {selectedTemplate?.guardrails.map((guardrail) => (
              <Collapsible key={guardrail}>
                <div className="border rounded-lg">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-accent/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium">{guardrail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {guardrailDetails[guardrail as keyof typeof guardrailDetails]?.count > 1 && (
                          <span className="text-sm text-muted-foreground">
                            {guardrailDetails[guardrail as keyof typeof guardrailDetails].count} guardrails
                          </span>
                        )}
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t">
                      <p className="text-sm text-muted-foreground">
                        {guardrailDetails[guardrail as keyof typeof guardrailDetails]?.description}
                      </p>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-1">Configure your policy</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Adjust the flagging sensitivity to control how strictly the guardrails are applied according to the relevant risk tolerance.
          </p>
          
          <div className="space-y-4">
            <Label>Flagging sensitivity</Label>
            <div className="relative">
              <Slider
                value={[sensitivity]}
                onValueChange={(value) => setSensitivity(value[0])}
                min={1}
                max={4}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <div><span className="font-medium">L1</span><br/>Lenient</div>
                <div className="text-center"><span className="font-medium">L2</span></div>
                <div className="text-center"><span className="font-medium">L3</span></div>
                <div className="text-right"><span className="font-medium">L4</span><br/>Strict</div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {sensitivityLevels.find((l) => l.value === sensitivity)?.label}: {sensitivityLevels.find((l) => l.value === sensitivity)?.description.split(" - ")[0]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {sensitivityLevels.find((l) => l.value === sensitivity)?.description.split(" - ")[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button variant="outline" onClick={() => navigate("/policies")}>
            Cancel
          </Button>
          <Button onClick={handleSavePolicy} disabled={isSubmitting}>
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update policy" : "Create policy")}
          </Button>
        </div>
      </div>
    </div>
  );
}
