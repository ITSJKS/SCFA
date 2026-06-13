def InnerSum(root):
    def s(root):
        if not root:
            return 0
        if not root.left and not root.right:
            return 0
        return root.val+s(root.left)+s(root.right)
    return s(root.left)+s(root.right)