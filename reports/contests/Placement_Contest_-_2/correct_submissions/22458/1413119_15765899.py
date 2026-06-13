def FindSqrt(x):
    # Complete the code here
    l = 1
    h = x
    while l <= h:
        m = (l + h) // 2
        # print(l , m , h)
        if m * m == x:
            ans = m
            return ans
        elif m * m < x:
            # return m
            l = m + 1
            ans = m
        else:
            h = m - 1
    return ans