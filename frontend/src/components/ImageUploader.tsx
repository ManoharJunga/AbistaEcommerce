import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Avatar, Button } from "@mui/material";

const ImageUploader: React.FC<{
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}> = ({ files, setFiles }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeImage = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <Box {...getRootProps()} sx={{ border: "1px dashed gray", p: 2, textAlign: "center" }}>
      <input {...getInputProps()} />
      {isDragActive ? <Typography>Drop files here ...</Typography> : <Typography>Drag & drop or click</Typography>}

      {files.length > 0 && (
        <Box mt={2}>
          {files.map((file, i) => (
            <Box key={file.name + i} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Avatar src={file instanceof File ? URL.createObjectURL(file) : (file as any).name} sx={{ width: 40, height: 40, mr: 1 }} />
              <Typography variant="body2">{file.name}</Typography>
              <Button onClick={() => removeImage(i)} color="error" size="small">
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUploader;
