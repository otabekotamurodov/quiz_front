"use client";
import Image from "next/image";
import { useState } from "react";
import { Button, Form, message, Modal, Select, Upload } from "antd";
import {
  DownloadOutlined,
  HeartOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import { jsPDF } from "jspdf";

import { Watch } from "@/components/watch";
import { MOTION_CONFIGS } from "@/consts";

import styles from "./page.module.scss";

const SELECT_OPTIONS = [5, 10, 15, 20];

const { useForm } = Form;
const { Option } = Select;
const { Dragger } = Upload;
const { useMessage } = message;

interface FormType {
  upload: { file: File };
  select: string;
}

interface Quiz {
  question_number: number;
  question: string;
  options: { [key: string]: string };
  correct_answer: string;
  correct_answer_text: string;
  explanation: string;
}

const Plant1 = () => (
  <Image
    unoptimized
    src="/scene/plant1.png"
    alt="plant"
    width={500}
    height={626}
    className={`${styles.item} ${styles.plant}`}
  />
);

const Plant2 = () => (
  <Image
    unoptimized
    src="/scene/plant2.png"
    alt="plant"
    width={300}
    height={320}
    className={`${styles.item} ${styles.plant_2}`}
  />
);

const Plant3 = () => (
  <Image
    unoptimized
    src="/scene/plant3.png"
    alt="plant"
    width={165}
    height={125}
    className={`${styles.item} ${styles.plant_3}`}
  />
);

const Books = () => (
  <div className={`${styles.item} ${styles.books_wrapper}`}>
    <Image
      unoptimized
      src="/scene/books.png"
      alt="books"
      width={200}
      height={215}
      className={`${styles.books}`}
    />
    <Image
      unoptimized
      src="/scene/apple.png"
      alt="apple"
      width={64}
      height={69}
      className={`${styles.apple}`}
    />
  </div>
);

const Clock = () => (
  <div className={`${styles.item} ${styles.clock}`}>
    <Watch />
  </div>
);

export default function Home() {
  const [form] = useForm();
  const [messageApi, contextHolder] = useMessage();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Array<Quiz> | null>(null);

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setQuiz(null);
  };

  const handleDownload = () => {
    if (!quiz) return;

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 10;
    const margin = 10;
    const maxLineWidth = doc.internal.pageSize.width - 2 * margin;
    let startY = 20;

    // Helper function to split text into lines
    const splitText = (text: string, maxWidth: number) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = doc.getTextWidth(currentLine + " " + word);
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // Add title
    doc.text("AI Quiz Generator Result", margin, startY);
    startY += 2 * lineHeight;

    quiz.forEach((item) => {
      const questionLines = splitText(
        `Question ${item.question_number}: ${item.question}`,
        maxLineWidth
      );
      const optionLines = Object.entries(item.options)
        .map(([key, value]) => splitText(`${key}: ${value}`, maxLineWidth))
        .flat();
      const correctAnswerLines = splitText(
        `Correct Answer: ${item.correct_answer}. ${item.correct_answer_text}`,
        maxLineWidth
      );

      const blockHeight =
        (questionLines.length +
          optionLines.length +
          correctAnswerLines.length +
          3) *
        lineHeight; // Including question, options, and correct answer

      if (startY + blockHeight > pageHeight) {
        doc.addPage();
        startY = 20; // Reset the starting Y position
      }

      questionLines.forEach((line) => {
        doc.text(line, margin, startY);
        startY += lineHeight;
      });

      optionLines.forEach((line) => {
        doc.text(line, margin, startY);
        startY += lineHeight;
      });

      correctAnswerLines.forEach((line) => {
        doc.text(line, margin, startY);
        startY += lineHeight;
      });

      startY += lineHeight + 10; // Add extra space before the next question
    });

    doc.save("quiz.pdf");
  };

  const handleSubmit = async (values: FormType) => {
    try {
      setLoading(true);
      message.open({
        key: "quiz",
        type: "loading",
        duration: 3000, // in seconds
        content: "Uploading, and generating quiz",
      });

      const formData = new FormData();
      formData.append("file", values.upload.file);

      const res = await axios.post(
        `http://quiz-api.mutolaa.com/generatequiz/?quiz_count=${values.select}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setQuiz(res.data.quiz_data.quiz);
      message.destroy("quiz");
    } catch (error) {
      console.log({ error });
      if (error instanceof AxiosError) {
        message.open({
          key: "quiz",
          type: "error",
          content: error.response?.statusText ?? error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.homepage}>
      {contextHolder}
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
        <Plant1 />
        <Plant2 />
        <Books />
        <Plant3 />
        <Clock />
      </div>
      <Modal
        closable={!loading && !quiz}
        centered
        open={open}
        footer={null}
        title={!quiz?.length ? "Generate Quiz" : "Quiz"}
        onCancel={loading || quiz ? undefined : handleClose}
        className={styles.modal}
        style={{ marginBlock: 24 }}
      >
        {!quiz?.length ? (
          <Form
            form={form}
            name="basic"
            layout="vertical"
            autoComplete="off"
            disabled={loading}
            initialValues={{ remember: true }}
            requiredMark="optional"
            onFinish={handleSubmit}
          >
            <Form.Item<FormType>
              name="upload"
              label="Upload file"
              required
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Dragger
                name="file"
                listType="picture"
                beforeUpload={() => false}
              >
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
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Select
                className={styles.select}
                placeholder="Choose number of questions"
              >
                {SELECT_OPTIONS.map((el) => (
                  <Option key={el} value={el}>
                    {el}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div className={styles.buttons_wrapper}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SignatureOutlined />}
                loading={loading}
              >
                Generate
              </Button>
            </div>
          </Form>
        ) : (
          <div className={styles.quiz}>
            {quiz.map((el) => (
              <div key={el.question_number} className={styles.item_wrapper}>
                <div className={styles.question}>
                  {el.question_number}. {el.question}
                </div>
                <div className={styles.options_wrapper}>
                  {Object.entries(el.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={styles.option}
                      data-correct={key === el.correct_answer}
                    >
                      {key}. {value}
                    </div>
                  ))}
                </div>
                <div className={styles.explanation}>
                  <InfoCircleOutlined className={styles.info_icon} />
                  {el.explanation}
                </div>
              </div>
            ))}
            <div className={styles.buttons_wrapper}>
              <Button onClick={handleClose}>Close</Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
