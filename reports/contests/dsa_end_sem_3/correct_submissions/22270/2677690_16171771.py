def isPresent(n, nums, t):
    s = 0
    e = n-1
    while s <= e:
        mid = (s+e) // 2
        if nums[mid] == t:
            return mid
            break
        elif nums[mid] > t:
            s = mid + 1
        else:
            e = mid - 1

    return -1