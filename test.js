import fs from "fs";
import isJpg from "is-jpg";
import test from "ava";
import m from "./index.js";
import { join, filename } from "desm";

test("extract file", async (t) => {
  const buf = fs.readFileSync(
    join(import.meta.url, "fixtures", "file.tar.bz2")
  );
  const files = await m()(buf);

  t.is(files[0].path, "test.jpg");
  t.true(isJpg(files[0].data));
});

test("extract file using streams", async (t) => {
  const stream = fs.createReadStream(
    join(import.meta.url, "fixtures", "file.tar.bz2")
  );
  const files = await m()(stream);

  t.is(files[0].path, "test.jpg");
  t.true(isJpg(files[0].data));
});

test("return empty array if non-valid file is supplied", async (t) => {
  const buf = fs.readFileSync(filename(import.meta.url));
  const files = await m()(buf);

  t.is(files.length, 0);
});

test("throw on wrong input", async (t) => {
  await t.throwsAsync(() => m()("foo"), {
    message: "Expected a Buffer or Stream, got string",
  });
});
