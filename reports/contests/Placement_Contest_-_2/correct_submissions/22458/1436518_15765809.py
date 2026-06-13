def FindSqrt(x):
    left = 1
    right = x
    res = 0
    while left<=right:
        mid = (left + right) // 2
        if (mid*mid) == x:
            return mid
        if  (mid*mid) < x:
            res = mid
            left = mid + 1
        else:
            right = mid - 1
    return res