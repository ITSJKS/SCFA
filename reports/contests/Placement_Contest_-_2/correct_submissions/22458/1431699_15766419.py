def FindSqrt(x):
    s = 1
    e = x
    ans = -1

    while s<=e:
        m = (s+e)//2
        if m*m <= x:
            s = m + 1
            ans = m
        else:
            e = m - 1
    return ans