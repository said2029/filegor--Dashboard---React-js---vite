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
import {
  CategoryType,
  SubCategorySchema,
  SubCategoryType,
} from "../../utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import FieldController from "../FieldController";
import SubmitButton from "../SubmitButton";
import { ImageValidation } from "../../utils/helpers";

interface FromSubCategoryProp {
  children: ReactNode;
  categotyOptions: Array<CategoryType>;
  type: "Create" | "Update";
  defaultValues?: SubCategoryType;
  create?: (body: FormData) => Promise<void>;
  update?: (id: string, data: FormData) => Promise<void>;
}

export default function FromSubCategory({
  children,
  categotyOptions,
  type,
  defaultValues,
  create,
  update,
}: FromSubCategoryProp) {
  const [SheetOpen, setSheetOpen] = useState(false);
  const form = useForm<SubCategoryType>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: defaultValues,
  });

  const Submit = async (value: SubCategoryType) => {
    // inject data on formData
    const DataForm = new FormData();
    if (value.file) {
      // valid Image field
      await ImageValidation([value.file]).then(
        (file) => {
          DataForm.append("file", file[0]);
        },
        (error) => {
          return form.control.setError("file", {
            type: "onChange",
            message: error,
          });
        },
      );
    }

    DataForm.append("name", value.name);
    if (value.categoryIds)
      DataForm.append("categoryIds", value.categoryIds.toString());

    if (type === "Create") {
      await create?.(DataForm).then(() => {
        setSheetOpen(false);
      });
    } else {
      await update?.(defaultValues!.id!, DataForm).then(() => {
        setSheetOpen(false);
      });
    }

    form.reset();
  };

  return (
    <Sheet open={SheetOpen} onOpenChange={(value) => setSheetOpen(value)}>
      <SheetTrigger className="py-0">{children}</SheetTrigger>
      <SheetContent className="w-full overflow-y-auto md:w-[40dvw]">
        <SheetHeader>
          <SheetTitle>{type} SubCategory</SheetTitle>
          <SheetDescription>
            Please fill out the form below to {type} a new category. Ensure all
            fields are correctly filled before submitting.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(Submit)} className="space-y-2">
              <FieldController
                type="file"
                Lable="SubCategory Image *"
                form={form}
                name="file"
              />
              <FieldController
                type="input"
                form={form}
                name="name"
                Lable="SubGategory Name *"
                placeholder="Gategory Name"
              />
              <FieldController
                type="multiSelect"
                form={form}
                name="categoryIds"
                Lable="Category Perant"
                placeholder="Category Perant"
                selectOptions={
                  categotyOptions
                    .filter((cat) => cat.id !== undefined)
                    .map((cat) => ({
                      id: cat.id as string,
                      name: cat.name,
                    })) ?? [{ id: "null", name: "" }]
                }
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
