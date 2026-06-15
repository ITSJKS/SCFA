def nextGreaterElement(arr):
    ans = []
    stack = []
    for i in range(len(arr) - 1 , -1 , -1):
        while stack and stack[-1] <= arr[i]:
            stack.pop()
        if stack:
            ans.append(stack[-1])
        else:
            ans.append(-1)
        stack.append(arr[i])
    print(*ans[::-1])
    # return ans