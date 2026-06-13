def FindSqrt(x):
    s = 1
    e = x//2

    ans = 0

    if (x < 2):
        return x

    while s <= e:
        mid = (s + e) // 2

        if mid <= x // mid:

            ans = mid
            s = mid + 1
        else:
            e = mid - 1

    return ans