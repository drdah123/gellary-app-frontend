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
  isUpdate,
}) {
  return (
    <Modal show={creating} onHide={onCancel}>
      <Modal.Header>{isUpdate ? 'تعديل المنشور' : 'انشاء منشور'}</Modal.Header>
      <Modal.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm(post._id);
          }}
        >
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
              value={post?.title}
              onChange={({ target }) => postHandler('title', target.value)}
            />
          </div>
          <div className="mb-1 mt-1">
            {isUpdate && (
              <>
                {' '}
                <p>الصورة السابقة</p>
                <img
                  className="card-img-top"
                  src={process.env.REACT_APP_BACKEND_URL + post?.image}
                  alt="Card cap"
                />
              </>
            )}
            <label className="form-label" htmlFor="image">
              الصورة
            </label>
            <input
              className="form-control"
              title="صوة"
              type="file"
              id="image"
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
              value={post?.description}
              onChange={({ target }) =>
                postHandler('description', target.value)
              }
            />
          </div>
          <Button type="submit">{isUpdate ? 'تعديل' : 'انشاء'}</Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
