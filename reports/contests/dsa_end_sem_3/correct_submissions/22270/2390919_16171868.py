def isPresent(n, nums, target):
    a = isP(0, n-1, nums, target, -1)
    if nums[a] == target:
        return a
    else:
        return -1

def isP(s, e, l, k, ans):
    if s > e:
        return ans
    m = (s+e)//2
    if l[m] >= k:
        ans = m
        s = m + 1
        return isP(s, e, l, k, ans)
    else:
        e = m - 1
        return isP(s, e, l, k, ans)