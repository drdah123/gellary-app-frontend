import React from 'react';
import { Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Error from './Error';

export default function CreatePost({
  post,
  postHandler,
  onCancel,
  creating,
  onConfirm,
  modelAlert,
}) {
  return (
    <Modal show={creating} onHide={onCancel}>
      <Modal.Header>انشاء منشور</Modal.Header>
      <Modal.Body>
        <form onSubmit={onConfirm}>
          <Error error={modelAlert} />
          <div className="mb-1">
            <label className="form-label" htmlFor="title">
              العنوان
            </label>
            <input
              className="form-control"
              required
              type="text"
              id="title"
              value={post.title}
              onChange={({ target }) => postHandler('title', target.value)}
            />
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label" htmlFor="price">
              السعر
            </label>
            <input
              className="form-control"
              required
              title="صوة"
              type="file"
              id="price"
              onChange={({
                target: {
                  files: [file],
                },
              }) => {
                postHandler('file', file);
              }}
            />
          </div>
          <div className="mb-1 mt-1">
            <label className="form-label" htmlFor="description">
              التفاصيل
            </label>
            <textarea
              className="form-control"
              required
              id="description"
              rows="3"
              value={post.description}
              onChange={({ target }) =>
                postHandler('description', target.value)
              }
            />
          </div>
          <Button type="submit">انشاء</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
