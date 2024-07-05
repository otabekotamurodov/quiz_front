"use client";
import { useState } from "react";
import { Button, Form, Modal, Select, Upload } from "antd";
import { HeartOutlined, InboxOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

import { Watch } from "@/components/watch";

import styles from "./page.module.scss";
import { MOTION_CONFIGS } from "@/consts";

const { useForm } = Form;
const { Dragger } = Upload;

interface FormType {
  upload: { file: File };
  select: [string] | [number];
}

export default function Home() {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormType) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", values.upload.file);

      const res = await axios.post(
        `http://quiz.mutolaa.com/generatequiz/?quiz_count=${values.select[0]}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log({ ddd: res.data });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.homepage}>
      <div className={styles.scene}>
        <AnimatePresence>
          <div className={styles.hero_wrapper}>
            <motion.h1 {...MOTION_CONFIGS}>AI Quiz Generator</motion.h1>
            <motion.p {...MOTION_CONFIGS} transition={{ delay: 0.1 }}>
              Helps to generate quiz based on book. Just upload the book, and
              enter number of questions. That{"'"}s it!
            </motion.p>
            <motion.div {...MOTION_CONFIGS} transition={{ delay: 0.2 }}>
              <Button
                size="large"
                type="primary"
                icon={<HeartOutlined />}
                onClick={() => setOpen(true)}
              >
                Start Generating
              </Button>
            </motion.div>
          </div>
        </AnimatePresence>

        <div className={`${styles.item} ${styles.plant}`} />
        <div className={`${styles.item} ${styles.plant_2}`} />
        <div className={`${styles.item} ${styles.books}`}>
          <div className={`${styles.item} ${styles.apple}`} />
        </div>
        <div className={`${styles.item} ${styles.plant_3}`} />
        <div className={`${styles.item} ${styles.clock}`}>
          <Watch />
        </div>
      </div>

      <Modal
        open={open}
        title="Generate Quiz"
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="generate"
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
          >
            Generate
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          autoComplete="off"
          initialValues={{ remember: true }}
          requiredMark="optional"
          onFinish={handleSubmit}
        >
          <Form.Item<FormType> name="upload" label="Upload file" required>
            <Dragger name="file" listType="picture" beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item<FormType>
            name="select"
            label="Number of questions"
            required
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Choose number of questions"
              maxCount={1}
              options={[
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 15, value: 15 },
                { label: 20, value: 20 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
