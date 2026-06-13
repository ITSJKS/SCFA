def nextGreaterElement(arr):
    end = 0

    n = len(arr)
    reached_end = False
    res = []
    for start in range(0, n):
        end = start
        reached_end = False
        while not reached_end and arr[start] >= arr[end]:
            end += 1
            if end == n:
                reached_end = True
                break
        if not reached_end:
            # print("here", arr[end])
            res.append(arr[end])
        else:
            res.append(-1)
    print(*res)