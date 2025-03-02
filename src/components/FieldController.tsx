import { ApplicationType, CategoryType, SubCategoryType } from "../utils/types";

import { MdDone } from "react-icons/md";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import JoditEditor from "jodit-react";
import { Label } from "./ui/label";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { GenerateUUID, ImageValidation } from "../utils/helpers";
import Icon from "./Icon";
import { UseFormReturn } from "react-hook-form";
import { ApplicationClass } from "../utils/actions";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { cn } from "../lib/utils";

export default function FieldController({
  form,
  name,
  type = "input",
  inputType = "text",
  multiple = false,
  selectOptions,
  placeholder,
  description,
  Lable,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: keyof ApplicationType | keyof CategoryType | keyof SubCategoryType;
  type?:
    | "input"
    | "select"
    | "editor"
    | "textareaArray"
    | "textarea"
    | "multiSelect"
    | "file";
  multiple?: boolean;
  placeholder?: string;
  Lable?: string;
  description?: string;
  selectOptions?: Array<{ id: string; name: string }>;
  className?: string;
  inputType?: React.HTMLInputTypeAttribute | undefined;
}) {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem
          className={cn("flex w-full flex-col transition-all", className)}
        >
          <Label>{Lable || placeholder}</Label>
          <FormControl className="transition-all duration-300">
            {type == "input" ? (
              <input
                placeholder={placeholder}
                className="h-11 w-full border border-black/35 bg-gray-300/30 px-3 outline-primary"
                {...field}
                type={inputType}
                value={field.value as string}
              />
            ) : type == "select" ? (
              <select
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value);
                }}
                defaultValue={field.value}
                className="h-11 border border-black/35 bg-gray-300/30 px-3 outline-primary"
                value={field.value}
              >
                <option value={""}>NULL</option>
                {selectOptions?.map((option) => (
                  <option
                    defaultChecked={field.value == option.id}
                    key={option.id}
                    className="cursor-pointer"
                    value={option.id}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            ) : type == "editor" ? (
              <TextEditor
                defaultValue={field.value as string}
                onChange={field.onChange}
              />
            ) : type == "textareaArray" ? (
              <textarea
                className="h-11 w-full border border-black/35 bg-gray-300/30 px-1 py-1 outline-primary"
                placeholder={placeholder}
                value={field?.value?.toString() as string}
                onChange={(event) => {
                  const value = event.target.value;
                  const toArray = value.split(",");
                  field.onChange(toArray);
                }}
              ></textarea>
            ) : type == "textarea" ? (
              <textarea
                className="h-11 w-full border border-black/35 bg-gray-300/30 px-3 outline-primary"
                placeholder={placeholder}
                value={field.value as string}
                onChange={(event) => {
                  const value = event.target.value;
                  field.onChange(value);
                }}
              ></textarea>
            ) : type == "multiSelect" ? (
              <MultiSelect
                onChange={field.onChange}
                placeholder={placeholder}
                selectOptions={selectOptions}
                vlaue={field.value as string[]}
              />
            ) : (
              type == "file" && (
                <UploadField
                  value={field.value}
                  onChange={field.onChange}
                  multiple={multiple}
                  form={form}
                />
              )
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const TextEditor = ({
  onChange,
  defaultValue,
}: {
  onChange: (value: string) => void;
  defaultValue: string;
}) => {
  const config = useMemo(
    () => ({
      readonly: false,
      iframe: true,
      spellcheck: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      height: 250,
      toolbarStickyOffset: 3,
    }),
    [],
  );

  const [content, setContent] = useState("");
  return (
    <JoditEditor
      onChange={onChange}
      value={defaultValue || content}
      config={config}
      onBlur={(newContent) => setContent(newContent)}
    />
  );
};

const MultiSelect = ({
  placeholder,
  selectOptions,
  onChange,
  vlaue,
}: {
  placeholder?: string;
  selectOptions?: Array<{ id: string; name: string }>;
  onChange?: (value: Array<string>) => void;
  vlaue?: string[];
}) => {
  const PerantEelematn = useRef<HTMLDivElement>(null);
  const [ValueOutput, setValueOutput] = useState<string[]>(vlaue ?? []);
  const [open, setOpen] = useState(false);

  const HandleSelect = (value: string) => {
    const NewValues = [...ValueOutput];
    if (NewValues.includes(value)) {
      setValueOutput(NewValues.filter((item) => item != value));
      return;
    }
    NewValues.push(value);
    onChange?.(NewValues);
    setValueOutput(NewValues);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CloseClickOut = (event: any) => {
    if (!event.target) return;
    if (!PerantEelematn.current?.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!PerantEelematn.current) return;
    document.addEventListener("click", CloseClickOut);
    return () => {
      document.removeEventListener("click", CloseClickOut);
    };
  }, []);

  return (
    <div ref={PerantEelematn} className="overflow-hidden">
      <div
        onClick={() => {
          setOpen((pre) => !pre);
        }}
        className="relative flex h-11 flex-wrap items-center gap-2 border border-black/35 bg-gray-300/30 px-2 py-1 outline-primary"
      >
        {ValueOutput && ValueOutput.length > 0 ? (
          ValueOutput.map((item) => (
            <span
              key={item}
              className="grid w-fit place-content-center rounded-full bg-primary px-2 py-1 text-white"
            >
              {selectOptions?.find((field) => field.id == item)?.name}
            </span>
          ))
        ) : (
          <p className="font-[500] text-zinc-950/35">{placeholder}</p>
        )}

        {open && (
          <div className="absolute right-3 top-3 cursor-pointer font-bold">
            X
          </div>
        )}
      </div>
      <hr />
      <AnimatePresence>
        {open && (
          <motion.div
            variants={{
              init: {
                y: "50px",
                display: "none",
              },
              show: { y: "0px", x: "0px", display: "block" },
              exit: {
                y: "100px",
                opacity: 0,
                display: "none",
              },
            }}
            initial="init"
            animate="show"
            exit={"exit"}
            className="absolute z-50 max-h-[400px] w-[300px] overflow-y-auto rounded-md bg-primary text-white"
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-1">
              {selectOptions?.map((item) => (
                <li
                  onClick={() => HandleSelect(item.id)}
                  className={clsx(
                    "flex cursor-pointer items-center gap-2 p-2 hover:bg-black/15",
                    {
                      "bg-black/15": ValueOutput.includes(item.id),
                    },
                  )}
                  key={item.id}
                >
                  <div className="grid size-5 place-content-center rounded-sm border">
                    {ValueOutput.includes(item.id) && <MdDone />}
                  </div>
                  <p>{item.name}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UploadField = ({
  multiple = false,
  onChange,
  value = [],
  form,
}: {
  multiple?: boolean;
  onChange: (files: Array<object> | object) => void;
  value: Array<object>;
  form: UseFormReturn;
}) => {
  const Cookies = useCookies(["authorization"]);

  const Key = GenerateUUID();
  const ref = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const GenerateLinkFilesBlob = (files: Array<any>) => {
    if (!files) return [];
    if (typeof files[0] == "object") {
      const links = files.map((file) => URL.createObjectURL(file));
      return links ?? [];
    }
    return files;
  };

  const [ImagesRander, setImagesRander] = useState<string[]>(
    GenerateLinkFilesBlob(value),
  );
  const OnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    ImageValidation(files).then(
      (_files) => {
        onChange(multiple ? _files : _files[0]);
        const links = GenerateLinkFilesBlob(_files);
        setImagesRander([...value, ...links]);
      },
      (err) => {
        form.control.setError("files", {
          type: "onChange",
          message: err,
        });
        throw new Error(err);
      },
    );
  };

  //  draggable Logic
  const [DragIndexs, setDragIndex] = useState<{
    dragIndex: number;
    dropIndex: number;
  }>({ dragIndex: NaN, dropIndex: NaN });

  const HandleDragStart = (event: PointerEvent) => {
    const dataSet = (event.currentTarget as HTMLElement)?.dataset?.index ?? NaN;
    setDragIndex({ dragIndex: +dataSet, dropIndex: NaN });
  };
  const HandleDragEnd = () => {
    if (
      isNaN(DragIndexs.dragIndex) ||
      isNaN(DragIndexs.dragIndex) ||
      DragIndexs.dragIndex === DragIndexs.dropIndex
    )
      return;

    const newArray = [...ImagesRander];
    const [movedItem1] = newArray.splice(
      DragIndexs.dragIndex,
      1,
      ImagesRander[DragIndexs.dropIndex],
    );
    newArray.splice(DragIndexs.dropIndex, 1, movedItem1);
    form.setValue(
      "images",
      newArray.filter((img) => typeof img == "string"),
    );
    setImagesRander(newArray);
  };

  // remove file form list
  const handleRemove = async (index: number) => {
    const ApplicationProvider = new ApplicationClass(Cookies[0].authorization);

    if (typeof ImagesRander[0] == "string") {
      if (form.getValues("id")) {
        const res = await ApplicationProvider.removeImage(
          form.getValues("id"),
          ImagesRander[index],
        );
        if (!res?.ok) {
          const res1 = await res.json();
          toast.error(res1.message);
        } else {
          const dd = ImagesRander.filter((_, i) => i !== index);
          setImagesRander(dd);
          const newValue = value.filter((_, i) => i !== index);
          onChange(newValue);
          toast.success("Image removed successfully");
        }
      }
    }
  };

  const randomKey = GenerateUUID();

  return (
    <div>
      <div key={Key} className="flex w-full items-center justify-center">
        <label
          htmlFor={`dropzone-file ${randomKey}`}
          className="relative flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
        >
          <div className="z-50 flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG</p>
          </div>
          <input
            onChange={OnChangeInput}
            ref={ref}
            multiple={multiple}
            id={`dropzone-file ${randomKey}`}
            type="file"
            className="hidden"
            accept="image/*.jpg,.png,.jpeg"
          />
          {!multiple && ImagesRander && ImagesRander.length >= 1 && (
            <div className="absolute top-0 h-full">
              <img className="h-full" src={ImagesRander && ImagesRander[0]} />
            </div>
          )}
        </label>
      </div>
      {/* drag images */}
      {multiple && (
        <div className="mt-2 flex flex-wrap gap-2">
          {ImagesRander.map((url: string, index: number) => (
            <motion.div
              onDragStart={HandleDragStart}
              onDragEnd={HandleDragEnd}
              onDragOver={(event: DragEvent<HTMLElement>) => {
                const index = event.currentTarget.dataset.index ?? NaN;
                if (isNaN(+index)) return;
                setDragIndex((pre) => ({ ...pre, dropIndex: +index }));
              }}
              data-index={index}
              layout
              draggable
              key={url}
              className="relative size-40 cursor-grab border-2 border-primary bg-red-500 shadow-xl active:cursor-grabbing"
            >
              <img
                draggable={false}
                src={url}
                className="pointer-events-none size-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  handleRemove(index);
                }}
                className="absolute right-2 top-1 z-20 rounded-lg bg-white p-2"
              >
                <Icon size={15} name="trash" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
