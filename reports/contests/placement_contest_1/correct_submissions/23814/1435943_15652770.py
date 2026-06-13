def firstOccurrence(nums):
    st, en=0, len(nums)
    while st < en:
        mid = (st+en)//2
        if nums[mid]==1:
            en=mid
        else:
            st=mid+1
    return (-1 if st==len(nums) else st)