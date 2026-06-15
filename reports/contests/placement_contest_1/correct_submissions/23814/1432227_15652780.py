def firstOccurrence(nums):
    st,en = 0,len(nums)-1
    while st <= en:
        mid = (st+en)//2
        if nums[mid] == 2:
            st = mid+1 
        else:
            en = mid-1
    if st == len(nums):
        return -1
    return st