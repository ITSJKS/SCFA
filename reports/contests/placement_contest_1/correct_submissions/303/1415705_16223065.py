def nextGreaterElement(arr):
    n = len(arr)

    ans = [-1] * n
    stack = []

    for i in range(n):

        while stack and arr[i] > arr[stack[-1]]:
            idx = stack.pop()
            ans[idx] = arr[i]

        stack.append(i)

    print(*ans)