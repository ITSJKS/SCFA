def nextGreaterElement(arr):
    # stack =[]
    # res = []
    # for i in range(len(arr)):
    #     if not stack:
    #         stack.append(arr[i])

    #     elif stack and stack[-1] < arr[i]:
    #         n = len(stack)
    #         for j in range(n):
    #             if stack[-1] < arr[i]:
    #                 res.append(arr[i])
    #                 stack.pop()
    #         stack.append(arr[i])

    #     elif stack and stack[-1] > arr[i]:
    #         stack.append(arr[i])

    # if res:
    #     res.append(-1)
    # else:
    #     for i in range(len(arr)):
    #         res.append(-1)
    # print(*res)
    # return res
    res = []
    n = len(arr)
    l=0
    r=l+1
    while l < n:
        if arr[r] > arr[l]:
            res.append(arr[r])
            l += 1
            if l == n-1:
                res.append(-1)
                break
            r = l + 1
        else:
            if r == n-1:
                res.append(-1)
                l += 1
                if l == n-1:
                    res.append(-1)
                    break
                r = l + 1
            else:
                r += 1
    print(*res)
    return