/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SubmitHandler,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ApplicationSchema, ApplicationType } from "../../utils/types";
import { Form } from "../ui/form";
import { ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import FieldController from "../FieldController";
import { IoAddOutline } from "react-icons/io5";
import { Accordion, AccordionContent, AccordionItem } from "../ui/accordion";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import Icon from "../Icon";
import clsx from "clsx";
import useCategory from "../../hooks/useCategory";
import { ImageValidation } from "../../utils/helpers";
import useVersion from "../../hooks/useVersion";
import { toast } from "react-toastify";

export default function FormApplication({
  children,
  type = "Create",
  create,
  update,
  defaultValues,
}: {
  children: ReactNode;
  type: "Create" | "Update";
  create?: (data: FormData) => Promise<any>;
  update?: (id: string, data: FormData) => Promise<any>;
  defaultValues?: ApplicationType;
}) {
  const [SheetOpen, setSheetOpen] = useState(false);
  const Form = useForm<ApplicationType>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {
      ...defaultValues,
      ...(defaultValues?.subCategory && {
        subCategory:
          defaultValues?.subCategory?.map((item: any) => item.id) ?? [],
      }),
      category: defaultValues?.category?.id ?? "",
    },
  });
  const { VersionProvider } = useVersion();

  const toDataForm = (value: ApplicationType) => {
    if (value?.files) {
      const NewFiles = value.files.filter(
        (file: object | string) => typeof file !== "string",
      );
      value.files = NewFiles;
    }
    const form = new FormData();
    if (value.files && Array.isArray(value.files)) {
      value.files.map((file) => {
        form.append("files", file);
      });
    }

    if (typeof value.category == "object") {
      delete value.category;
    }
    delete value.id;
    const Entries = Object.entries(value);
    Entries.map(([key, value]) => {
      if (
        key == "versions" ||
        key == "createAt" ||
        !value ||
        value == null ||
        value == ""
      )
        return;
      form.append(key, value);
    });
    return form;
  };

  const Valid_Send = (
    value: ApplicationType,
    send: (form: FormData) => Promise<void>,
  ) => {
    ImageValidation(value.files).then(
      async () => {
        const form = toDataForm(value);
        await send(form);
      },
      (err) => {
        Form.control.setError("files", {
          type: "onChange",
          message: err,
        });
        return;
      },
    );
  };
  const Submit = async (value: ApplicationType) => {
    if (type == "Create") {
      await Valid_Send(value, async (form) => {
        form.delete("images");
        await create?.(form).then((res) => {
          if (res?.error) return;
          setSheetOpen(false);
          Form.reset();
        });
      });
    } else {
      if (value.files && typeof value.files[0] != "string") {
        await Valid_Send(value, async (form) => {
          await update?.(defaultValues!.id!, form).then(() => {
            setSheetOpen(false);
            Form.reset();
          });
        });
        return;
      }

      const form = toDataForm(value);
      await update?.(defaultValues!.id!, form).then(() => {
        setSheetOpen(false);
        Form.reset();
      });

      if (value.versions) {
        await Promise.all(
          value.versions?.map(async (ver) => {
            if (ver.id) {
              return await VersionProvider.UpdateVersion(ver.id, ver);
            }
          }),
        )
          .then(() => {
            setSheetOpen(false);
            Form.reset();
          })
          .catch(() => {
            toast.error("Failed to update versions. Please try again.");
          });
      }
    }
  };
  return (
    <Sheet
      open={SheetOpen}
      onOpenChange={(open) => {
        setSheetOpen(open);
      }}
    >
      <SheetTrigger>{children}</SheetTrigger>

      <SheetContent className="w-full overflow-y-auto md:w-[60dvw]">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            Please review the application details carefully before submitting.
            Ensure all information is accurate and complete.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <From form={Form} type={type} onSubmit={Submit} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

const From = ({
  onSubmit,
  type = "Create",
  form,
}: {
  onSubmit: SubmitHandler<ApplicationType>;
  type: "Create" | "Update";
  form: UseFormReturn<ApplicationType>;
}) => {
  const { Categorys } = useCategory();

  const VersionFields = useFieldArray({
    control: form.control,
    name: "versions",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldController
          form={form}
          type="file"
          placeholder="Images"
          Lable="Images"
          name="files"
          multiple
        />
        <FieldController
          type="input"
          form={form}
          placeholder="Title"
          Lable="Title *"
          name="title"
        />
        <FieldController
          type="input"
          form={form}
          placeholder="SubTitle *"
          name="subtitle"
        />
        <div className="relative flex">
          <FieldController
            placeholder="Size"
            type="input"
            form={form}
            name="size"
            Lable="Size *"
          />
          <FieldController
            className="w-24"
            type="select"
            selectOptions={[
              { id: "KB", name: "KB" },
              { id: "MB", name: "MB" },
              { id: "GB", name: "GB" },
              { id: "TB", name: "TB" },
              { id: "PB", name: "PB" },
            ]}
            form={form}
            name="sizeType"
            Lable="SizeType *"
          />
        </div>

        <div className="flex gap-2">
          <FieldController
            type="input"
            form={form}
            placeholder="Created By .eg Elisa Sporer"
            Lable="Created By *"
            name="createdBy"
          />
          <FieldController
            type="input"
            form={form}
            placeholder="Uploaded By .eg Adobe"
            Lable="Uploaded By"
            name="uploadedBy"
          />
        </div>
        <FieldController
          type="input"
          placeholder="License Type .eg full_version"
          Lable="licenseType *"
          form={form}
          name="licenseType"
        />
        <div className="flex gap-2">
          <FieldController
            className={clsx("", {
              "pointer-events-none opacity-75": form.getValues("category"),
            })}
            type="select"
            placeholder="category"
            Lable="Category *"
            name="category"
            form={form}
            selectOptions={
              Categorys?.filter((dd) => dd.id != undefined).map((cat) => ({
                id: cat.id as string,
                name: cat.name,
              })) ?? [{ id: "", name: "" }]
            }
          />
          {Categorys?.find((item) => item.id == form.getValues("category")) && (
            <FieldController
              type="multiSelect"
              placeholder="SubCategory"
              Lable="SubCategory *"
              name="subCategory"
              form={form}
              selectOptions={Categorys?.find(
                (item) => item.id == form.getValues("category"),
              )?.subCategory?.map((cat: any) => ({
                id: cat.id as string,
                name: cat.name,
              }))}
            />
          )}
        </div>

        <FieldController
          type="textareaArray"
          placeholder="Languages .eg English, Arabic"
          Lable="Languages *"
          form={form}
          name="languages"
          description="Add ',' between Languages"
        />
        <FieldController
          type="textareaArray"
          placeholder="Requirements .eg Windows 10, Windows 11"
          Lable="Requirements"
          form={form}
          name="requirements"
          description="Add ',' between Requirements"
        />
        <FieldController
          type="editor"
          placeholder="Description"
          Lable="Description *"
          form={form}
          name="description"
        />

        <div className="relative">
          {type === "Create" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black p-4 text-center text-white">
              Please save the application first to enable version management.
            </div>
          )}
          <div
            className={clsx("", {
              "pointer-events-none opacity-30": type == "Create",
            })}
          >
            <FiledVersions VersionFields={VersionFields} form={form} />
          </div>
        </div>

        <button
          type="submit"
          className="sticky bottom-2 right-4 rounded-md bg-primary p-2 px-8 text-white"
        >
          {type}
        </button>
      </form>
    </Form>
  );
};

const FiledVersions = ({
  VersionFields,
  form,
}: {
  VersionFields: UseFieldArrayReturn<ApplicationType, "versions">;
  form: UseFormReturn<any>;
}) => {
  const { VersionProvider } = useVersion();
  return (
    <div>
      <div
        onClick={async () => {
          await VersionProvider.CreateVersion({
            programId: form.getValues("id"),
            fullName: "",
            links: [],
            torrents: [],
            versionName: "",
          }).then(() => {
            VersionFields.append({
              fullName: "",
              links: [],
              torrents: [],
              versionName: "",
            });
          });
        }}
        className="mb-4 grid size-10 cursor-pointer place-content-center rounded-lg border-2 border-black transition-all duration-300 hover:bg-black hover:text-white"
      >
        <IoAddOutline size={20} />
      </div>

      <Accordion type="single" collapsible>
        {VersionFields.fields.map((field, index) => (
          <AccordionItem key={field.id} value={field.id}>
            <AccordionTrigger className="flex w-full items-center justify-between bg-primary px-2 py-2 text-white">
              <p>Version {index}</p>
              <div
                onClick={async () => {
                  toast.promise(
                    VersionProvider.Delete(
                      form.getValues(`versions.${index}.id`),
                    ).then(() => {
                      VersionFields.remove(index);
                    }),
                    {
                      pending: "Deleting version...",
                      success: "Version deleted successfully!",
                      error: "Failed to delete version.",
                    },
                  );
                }}
                className="grid size-10 cursor-pointer place-content-center rounded-lg border-2 border-black bg-white transition-all duration-300 hover:bg-black hover:text-white"
              >
                <Icon size={20} name="trash" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="relative space-y-2 bg-primary/10 px-2 py-4">
              <FieldController
                type="input"
                placeholder="Full Name"
                Lable="Full Name *"
                form={form}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={`versions.${index}.fullName`}
              />
              <FieldController
                type="input"
                placeholder="Version Name"
                Lable="Version Name *"
                form={form}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={`versions.${index}.versionName`}
              />
              <FieldController
                type="textareaArray"
                placeholder="Download Links.eg link 1 , link 2"
                Lable="Download Links *"
                description="Add `,` between links"
                form={form}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={`versions.${index}.links`}
              />
              <FieldController
                type="textareaArray"
                placeholder="Torrent Links .eg link 1 , link 2"
                Lable="Torrent Links"
                description="Add `,` between links"
                form={form}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name={`versions.${index}.torrents`}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
