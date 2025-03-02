/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useForm } from "react-hook-form";
import { CategorySchema, CategoryType } from "../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import FieldController from "../FieldController";
import SubmitButton from "../SubmitButton";
import { ImageValidation } from "../../utils/helpers";
import { toast } from "react-toastify";
import useSubCategory from "../../hooks/useSubCategory";

export default function FromCategory({
  children,
  create,
  update,
  defaultValues,
  type = "Create",
}: {
  children: ReactNode;
  create?: (data: FormData) => Promise<void>;
  update?: (id: string, data: FormData) => Promise<void>;
  defaultValues?: CategoryType;
  type: "Create" | "Update";
}) {
  const [SheetOpen, setSheetOpen] = useState(false);
  const { SubCategorys } = useSubCategory({ perPage: 100 });
  const form = useForm<CategoryType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: defaultValues?.name,
      file: defaultValues?.file,
      subCategoryIds: defaultValues?.subCategory?.map((ite) => ite.id) ?? [],
    },
  });

  const Submit = async (value: any) => {
    const DataForm = new FormData();
    console.log(value);
    if (value.file) {
      if (typeof value.file != "string") {
        // valid Image field
        await ImageValidation([value.file])
          .then((file) => {
            DataForm.append("file", file[0]);
          })
          .catch((err) => {
            toast.error(err);
          });
      }
    }

    // inject data on formData
    DataForm.append("name", value.name);
    DataForm.append("subCategoryIds", value.subCategoryIds);
    // create founction from useCategory hook
    if (type == "Create") {
      await create?.(DataForm).then(() => {
        setSheetOpen(false);
      });
    } else {
      if (!defaultValues) return;
      await update?.(defaultValues.id!, DataForm).then(() => {
        setSheetOpen(false);
      });
    }
  };

  return (
    <Sheet open={SheetOpen} onOpenChange={(value) => setSheetOpen(value)}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto md:w-[40dvw]">
        <SheetHeader>
          <SheetTitle>{type} Category</SheetTitle>
          <SheetDescription>
            Please fill out the form below to {type} a new category. Ensure all
            required fields are completed.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(Submit)} className="space-y-2">
              <FieldController
                type="file"
                Lable="Category Image *"
                form={form}
                name="file"
              />
              <FieldController
                type="input"
                form={form}
                name="name"
                Lable="Gategory Name *"
                placeholder="Gategory Name"
              />
              <FieldController
                type="multiSelect"
                selectOptions={SubCategorys?.filter(
                  (ite) => ite.id !== undefined,
                ).map((ite) => ({
                  id: ite.id!,
                  name: ite.name,
                }))}
                form={form}
                name="subCategoryIds"
                Lable="subCategory "
                placeholder="SubCategory Name"
              />
              <SubmitButton
                type="submit"
                isLoading={form.formState.isSubmitting}
              />
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
