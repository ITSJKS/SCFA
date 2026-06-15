def nextGreaterElement(arr):
    stack  = []
    ans = []
    for i in range(len(arr)-1, -1,-1):
        while stack and arr[i] >= stack[-1]:
            stack.pop()
        if stack:
            ans.append(stack[-1])
        else:
            ans.append(-1)
        stack.append(arr[i])
    for i in ans[::-1]:
        print(i , end = " ")

    # x = []
    # for i in range(len(arr)-1):
    #     if arr[i]<arr[i+1]:
    #         x.append(arr[i+1])
    #     else:
    #         x.append(-1)
    # x.append(-1)
    # print(x)