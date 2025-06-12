"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCanvasStore } from "@/context/useCanvas";

const formSchema = z.object({
  width: z.number().min(100).max(1920),
  height: z.number().min(100).max(1080),
});

type props = {
  setOpenAction: (open: boolean) => void;
};
export default function CanvasSizeForm({ setOpenAction }: props) {
  const { setSize, width, height } = useCanvasStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      width: width,
      height: height,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSize(values.width, values.height);
    setOpenAction(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>
                  <FormControl>
                    <div className=" flex justify-center items-center gap-2">
                      <Input
                        placeholder=""
                        type="number"
                        min={100}
                        max={1920}
                        {...field}
                        onChange={(e) => {
                          if (!isNaN(e.target.valueAsNumber)) {
                            field.onChange(e.target.valueAsNumber);
                          } else {
                            field.onChange(0);
                          }
                        }}
                      />
                      <p>Px</p>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <div className=" flex justify-center items-center gap-2">
                      <Input
                        placeholder=""
                        type="number"
                        min={100}
                        max={1080}
                        {...field}
                        onChange={(e) => {
                          if (!isNaN(e.target.valueAsNumber)) {
                            field.onChange(e.target.valueAsNumber);
                          } else {
                            field.onChange(0);
                          }
                        }}
                      />
                      <p>Px</p>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className=" flex justify-end items-center">
          <Button type="submit">Resize</Button>
        </div>
      </form>
    </Form>
  );
}
