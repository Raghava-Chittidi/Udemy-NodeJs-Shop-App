const deleteProduct = (btn) => {
  const productId = btn.parentElement.querySelector("[name=productId]").value;
  const csrf = btn.parentElement.querySelector("[name=_csrf]").value;
  const product = btn.closest("article");

  fetch("/admin/products/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      product.parentNode.removeChild(product);
      console.log(data);
    })
    .catch((err) => console.log(err));
};
