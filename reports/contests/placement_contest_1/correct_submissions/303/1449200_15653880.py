def nextGreaterElement(arr):
    # end = 0
    # n = len(arr)
    # reached_end = False
    # res = []
    # for start in range(0, n):
    #     end = start
    #     reached_end = False
    #     while not reached_end and arr[start] >= arr[end]:
    #         end += 1
    #         if end == n:
    #             reached_end = True
    #             break
    #     if not reached_end:
    #         res.append(arr[end])
    #     else:
    #         res.append(-1)
    # print(*res)

    res = []
    n = len(arr)
    for i in range(0, n):
        for j in range(i + 1, n):
            if arr[j] > arr[i]:
                res.append(arr[j])
                break
        else:
            res.append(-1)

    print(*res)