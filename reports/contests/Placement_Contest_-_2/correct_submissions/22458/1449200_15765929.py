def FindSqrt(x):
    start, end =0, x
    res = 0
    while start <= end:
        mid = start + ((end - start) // 2)
        if mid * mid <= x:
            res = mid
            start = mid + 1
        else:
            end = mid - 1

    return res