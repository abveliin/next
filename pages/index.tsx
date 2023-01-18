import React, { useState, useRef } from "react";
import { prisma } from "../lib/prisma";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Wysiwyg = dynamic(() => import("../components/Wysiwyg.jsx"), {
  ssr: false,
});

interface FormData {
  title: string;
  content: string;
  id: string;
}

interface Posts {
  posts: {
    id: string;
    title: string;
    content: string;
  }[];
}

export default function Home({ posts }: Posts) {
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });
  let [content, setContent] = useState("");
  form.content = content;
  // I use these two variable of codes in order to update the list after pushing on a server and I'mna call it after submitting the form in then method
  const router = useRouter();

  const refresh_data = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    if (data.id) {
      try {
        fetch(`http://localhost:3000/api/post/${data.id}`, {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
        })
          .then(() => {
            setForm({ title: "", content: "", id: "" });
            setContent("");
            refresh_data();
            console.log("then we update");
          })
          .catch((e) => console.log(e));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await fetch(`http://localhost:3000/api/post/create`, {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then(() => {
            setForm({ title: "", content: "", id: "" });
            setContent("");
            refresh_data();
            console.log("then we create");
          })
          .catch((e) => console.log(e));
      } catch (error) {
        console.log(error);
      }
    }
  }

  const delete_fn = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/post/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          refresh_data(); // for updating the retreiving list after a submit
          console.log("delete");
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
    }
  };

  const submit_fn = async (data: FormData) => {
    try {
      // DOMPurify.sanitize(data)
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">Notes for testing</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit_fn(form);
        }}
        className="w-auto min-w-[75%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
      >
        <input
          type="text"
          placeholder="Title I'm testing postgres in VPS"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />

        <Wysiwyg content={form.content} setContent={setContent} />

        <button type="submit" className="bg-blue-500 text-white rounded p-1">
          Add +
        </button>
      </form>

      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch">
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-b border-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex">
                    <button
                      onClick={() => delete_fn(post.id)}
                      className="bg-red-500 text-white p-1 mr-2"
                    >
                      X
                    </button>
                    <button
                      onClick={() => {
                        setForm({
                          title: post.title,
                          content: post.content,
                          id: post.id,
                        });
                        setContent(post.content);
                      }}
                      className="bg-blue-500 text-white p-1 mr-2"
                    >
                      update
                    </button>

                    <h1 className="font-bold">{post.title}</h1>
                  </div>

                  <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const posts = await prisma.post.findMany({
    // created_at and updated_at can be dificult to retreive that's why I add these parameters in findMany function
    select: {
      title: true,
      id: true,
      content: true,
    },
    orderBy: { create_at: "desc" },
  });

  return {
    props: {
      posts,
    },
  };
};
